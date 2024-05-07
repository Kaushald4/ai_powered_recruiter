import { TypeOf, z } from "zod";

export const JobPostSchema = z.object({
    title: z.string(),
    location: z.string(),
    totalQuestions: z.optional(z.string()),
    experienceLevel: z.array(z.object({ title: z.string() })),
    jobDetails: z.string(),
    questionGenMode: z.string(),
    questions: z.optional(
        z.array(
            z.object({
                title: z.string(),
            })
        )
    ),
});

export const EditJobPostSchema = z.object({
    title: z.optional(z.string()),
    location: z.optional(z.string()),
    totalQuestions: z.optional(z.string()),
    experienceLevel: z.optional(z.array(z.object({ title: z.string() }))),
    jobDetails: z.optional(z.string()),
    questionGenMode: z.optional(z.string()),
    jobid: z.optional(z.number()),
    questions: z.optional(
        z.array(
            z.object({
                title: z.string(),
                jobPostId: z.number(),
            })
        )
    ),
});

export type TJobPost = z.infer<typeof JobPostSchema>;

export const UpdateUserSchema = z.object({
    email: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    yoe: z.string(),
});

export type TUpdateUserReq = z.infer<typeof UpdateUserSchema>;
