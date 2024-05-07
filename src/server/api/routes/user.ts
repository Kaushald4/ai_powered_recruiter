import { router, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

import {
    EditJobPostSchema,
    JobPostSchema,
    UpdateUserSchema,
} from "@/types/user";
import { getCaller } from "../root";
import { JobStatus } from "@prisma/client";

export const userRouter = router({
    saveCustomQuestions: protectedProcedure
        .input(
            z.array(
                z.object({
                    title: z.string(),
                    jobPostId: z.number(),
                })
            )
        )
        .mutation(async ({ ctx, input }) => {
            console.log(input, "asakskamska");
            await ctx.db.customizedQuestion.createMany({
                data: input,
            });
            console.log("questions created");
            // ctx.db.customizedQuestion.createMany({data: })
        }),

    updateQuestions: protectedProcedure
        .input(
            z.array(
                z.object({
                    title: z.string(),
                    jobPostId: z.number(),
                })
            )
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db.customizedQuestion.updateMany({
                where: {
                    jobPostId: input[0].jobPostId,
                },
                data: input,
            });
        }),

    deleteJobPost: protectedProcedure
        .input(z.object({ jobPostId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.jobPost.update({
                where: { id: input.jobPostId },
                data: { status: JobStatus.INACTIVE },
            });
            return {
                success: true,
                message: "Job Post Deleted successfully",
            };
        }),

    postJob: protectedProcedure
        .input(JobPostSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findFirst({
                where: { id: ctx.session.user.id },
            });
            const {
                experienceLevel,
                jobDetails,
                location,
                questions,
                title,
                totalQuestions,
                questionGenMode,
            } = input;

            if (
                !(
                    experienceLevel ||
                    jobDetails ||
                    location ||
                    questions ||
                    title ||
                    totalQuestions ||
                    questionGenMode
                )
            )
                throw new Error("Missing Input Fields!");
            const savedJobPost = await ctx.db.jobPost.create({
                data: {
                    experienceLevel: experienceLevel
                        .map((exp) => exp.title)
                        .join(","),
                    jobDetails,
                    location,
                    title,
                    totalQuestions: Number(totalQuestions),
                    authorId: ctx.session.user.id,
                    questionGenMode: questionGenMode,
                    jobCategory: "dummy", //TODO:
                    companyName: user?.companyName,
                },
            });

            if (
                questionGenMode === "custom" &&
                questions &&
                questions.length >= 1
            ) {
                const caller = await getCaller();
                const questionToSave = questions.map((q) => {
                    return {
                        title: q.title,
                        jobPostId: savedJobPost.id,
                    };
                });

                await caller.user.saveCustomQuestions(questionToSave);
            }
        }),

    getJobDetailsById: protectedProcedure
        .input(z.object({ jobId: z.number() }))
        .query(async ({ ctx, input }) => {
            const jobDetails = await ctx.db.jobPost.findFirst({
                where: { id: input.jobId },
                include: {
                    questions: true,
                    InterviewDtl: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return jobDetails;
        }),

    updateJobDetail: protectedProcedure
        .input(EditJobPostSchema)
        .mutation(async ({ ctx, input }) => {
            let dataToUpdate = { ...input };
            delete dataToUpdate["jobid"];
            delete dataToUpdate["questions"];

            await ctx.db.jobPost.update({
                where: {
                    id: input.jobid,
                },
                data: {
                    ...dataToUpdate,
                    experienceLevel: dataToUpdate
                        .experienceLevel!.map((exp) => exp.title)
                        .join(","),
                    totalQuestions: Number(dataToUpdate.totalQuestions),
                } as any,
            });
            if (input.questionGenMode === "custom") {
                const caller = await getCaller();
                const questionToSave = input.questions!.map((q) => {
                    return {
                        title: q.title,
                        jobPostId: q.jobPostId,
                    };
                });

                await caller.user.updateQuestions(questionToSave);
            }
            return {
                status: true,
                message: "Updated successfully ",
            };
        }),
    getMyPostedJobList: protectedProcedure.query(({ ctx, input }) => {
        const jobList = ctx.db.jobPost.findMany({
            where: {
                authorId: ctx.session.user.id,
                status: JobStatus.ACTIVE,
            },
            include: {
                author: true,
                questions: true,
            },
        });
        return jobList;
    }),

    getAllJobs: publicProcedure.query(async ({ ctx, input }) => {
        const jobs = await ctx.db.jobPost.findMany({
            where: {
                status: JobStatus.ACTIVE,
            },
            include: { InterviewDtl: true },
        });
        return jobs;
    }),

    updateUser: protectedProcedure
        .input(UpdateUserSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db.user.update({
                where: { id: ctx.session.user.id },
                data: {
                    ...input,
                },
            });
            return "Success";
        }),
    profile: protectedProcedure.query(async ({ ctx, input }) => {
        const user = await ctx.db.user.findFirst({
            where: { email: ctx.session.user.email! },
        });
        return user;
    }),
});
