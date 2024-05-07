import { router, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

import { getCaller } from "../root";
import { UserRole } from "@prisma/client";
const genAI = new GoogleGenerativeAI(env.LLM_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

export const questionRouter = router({
    generateQuestion: protectedProcedure
        .input(z.object({ jodId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const caller = await getCaller();
            const jobDetails = await ctx.db.jobPost.findFirst({
                where: {
                    id: input.jodId,
                },
            });

            // create and save interview
            const interviewDtl = await ctx.db.interviewDtl.create({
                data: {
                    userId: ctx.session.user.id,
                    jobPostId: input.jodId,
                },
            });

            if (jobDetails?.questionGenMode === "ai") {
                const prompt = `
                you are a professional interviewer in taking who can take interviews across various categories.
                Make sure you are Generating ${jobDetails?.totalQuestions} different questions for candidate based on ${jobDetails.jobDetails} and ${jobDetails?.experienceLevel} level everytime.
                Make sure question generated once are not repeated.
                Make sure you are strictly generating questions based on provided job roles & details.
                return response in JSON format
                                [
                                    {
                                    "title": "xxxx"
                                    }
                                ]
                                where xxxx is generated question
                `;
                // generate questins through ai
                const response = await model.generateContent(prompt);
                try {
                    const strQuestion = response.response.text();
                    let cleanedString = strQuestion
                        .trim()
                        .replace(/^```json\s*/, "");
                    cleanedString = cleanedString.replace(/\s*```/, "");
                    const jsonArray = JSON.parse(cleanedString);
                    const generatedQuestions = jsonArray.map(
                        (question: any) => {
                            return {
                                ...question,
                                interviewDtlId: interviewDtl.id,
                            };
                        }
                    );

                    await ctx.db.interviewQuestion.createMany({
                        data: generatedQuestions,
                    });

                    return interviewDtl;
                } catch (error) {
                    console.log(error);
                    return "Failed to generate questions try again!";
                }
            } else {
                let customQuestions = await ctx.db.customizedQuestion.findMany({
                    where: { jobPostId: input.jodId },
                });
                const cQuestion = customQuestions.map((question: any) => {
                    return {
                        title: question.title,
                        interviewDtlId: interviewDtl.id,
                    };
                });
                await ctx.db.interviewQuestion.createMany({
                    data: cQuestion,
                });
                return interviewDtl;
            }
        }),

    getInterviewQuestions: protectedProcedure
        .input(z.object({ interviewId: z.number() }))
        .query(async ({ ctx, input }) => {
            console.log(input.interviewId, "asnaksnaksnknsknk");
            const interview = await ctx.db.interviewDtl.findFirst({
                where: { id: input.interviewId },
                include: { interviewQuestions: true, jobPost: true },
            });
            return interview;
        }),

    saveUserTranscript: protectedProcedure
        .input(
            z.object({
                questionId: z.number(),
                transcript: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db.interviewQuestion.update({
                where: { id: input.questionId },
                data: { answer_transcript: input.transcript },
            });
            return {
                success: true,
                message: "transcript saved",
            };
        }),

    saveInterviewVideoLink: protectedProcedure
        .input(
            z.object({
                interviewId: z.number(),
                video_link: z.string(),
                questionId: z.number(),
                transcript: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db.interviewDtl.update({
                where: { id: input.interviewId },
                data: { video_link: input.video_link, is_completed: true },
            });

            await ctx.db.interviewQuestion.update({
                where: { id: input.questionId },
                data: { answer_transcript: input.transcript },
            });

            const interviewDetails = await ctx.db.interviewDtl.findFirst({
                where: { id: input.interviewId },
                include: {
                    interviewQuestions: true,
                },
            });

            const resp = interviewDetails?.interviewQuestions.map((inter) => {
                return {
                    interview_question: inter.title,
                    candidate_answer: inter.answer_transcript,
                };
            });
            // summary for both candidate
            const candidatePrompt = `
                        
            As an experienced interviewer conducting screening interviews provide initial feedback to candidates about the strengths and areas for improvement in their interview skills.
            this is the actual interview details
            Analyze the response of the candidate with respect to the questions asked during the interview. if the candidate has not responded then add suggestions to read about those topics.
            ${JSON.stringify(resp)}
            
            Provide the feedback not more than 5 points.
            At the end of the feedback session, you can conclude by saying:
            "Please note that the HR team will be taking the final decision regarding the interview process. They will update you about the next steps if you qualify for the next round. All the best!"
            share the report in markdown format so that it's readable
        `;

            const recruiterResponse = `
            As an experienced interviewer, analyze the candidates response for the questions asked and provide a detailed evaluation of the candidate. Also give score to skills mentioned below
            ${JSON.stringify(resp)}
            
            Communication Skills: [Score] / 10
            Comments: [Briefly explain how the candidate demonstrated their communication skills, any standout moments or areas for improvement.]
            Technical Skills: [Score] / 10
            Comments: [Detail the candidate's technical proficiency as relevant to the job role, noting specific strengths or gaps.]
            Problem-Solving Ability: [Score] / 10
            Comments: [Discuss how the candidate approached problem-solving questions, their creativity, and logical reasoning.]
            Overall Score: [Score] / 10
            Comments: [Share the overall score of the candidate, consider all the metrics and skills and share a final score out of 10 - If the candidate is not fit for the role give less score and if the candiate is good or can be considered for next rounds give score accordingly]
            
            overall candidate score should be in this format
            ''' overall score here '''
            `;

            const modelResponse = await model.generateContent(candidatePrompt);
            const recruiterReposne = await model.generateContent(
                recruiterResponse
            );

            await ctx.db.interviewDtl.update({
                where: { id: input.interviewId },
                data: {
                    candidateSummary: modelResponse.response.text(),
                    recruiter: recruiterReposne.response.text(),
                },
            });
            return {
                success: true,
                message: "video link saved",
                candiae: modelResponse.response.text,
            };
        }),

    getMyInterviewReport: protectedProcedure
        .input(z.object({ interviewId: z.number() }))
        .query(async ({ ctx, input }) => {
            const interviewDetail = await ctx.db.interviewDtl.findFirst({
                where: { id: input.interviewId },
            });
            if (
                interviewDetail &&
                ctx.session.user.role === UserRole.CANDIDATE
            ) {
                interviewDetail.recruiter = null;
                interviewDetail.candidateScore = null;
            }
            return interviewDetail;
        }),

    // tempTest: protectedProcedure.query(async ({ ctx, input }) => {
    //     const interviewDetails = await ctx.db.interviewDtl.findFirst({
    //         where: { id: 21 },
    //         include: {
    //             interviewQuestions: true,
    //         },
    //     });

    //     const resp = interviewDetails?.interviewQuestions.map((inter) => {
    //         return {
    //             interview_question: inter.title,
    //             candidate_answer: inter.answer_transcript,
    //         };
    //     });
    //     // summary for both candidate and
    //     const candidatePrompt = `

    // As an experienced interviewer conducting screening interviews provide initial feedback to candidates about the strengths and areas for improvement in their interview skills.
    // this is the actual interview details
    // Analyze the response of the candidate with respect to the questions asked during the interview. if the candidate has not responded then add suggestions to read about those topics.
    // ${JSON.stringify(resp)}

    // Provide the feedback not more than 5 points.
    // At the end of the feedback session, you can conclude by saying:
    // "Please note that the HR team will be taking the final decision regarding the interview process. They will update you about the next steps if you qualify for the next round. All the best!"
    // share the report in markdown format so that it's readable
    // `;

    //     const recruiterResponse = `
    // As an experienced interviewer, analyze the candidates response for the questions asked and provide a detailed evaluation of the candidate. Also give score to skills mentioned below
    // ${JSON.stringify(resp)}

    // Communication Skills: [Score] / 10
    // Comments: [Briefly explain how the candidate demonstrated their communication skills, any standout moments or areas for improvement.]
    // Technical Skills: [Score] / 10
    // Comments: [Detail the candidate's technical proficiency as relevant to the job role, noting specific strengths or gaps.]
    // Problem-Solving Ability: [Score] / 10
    // Comments: [Discuss how the candidate approached problem-solving questions, their creativity, and logical reasoning.]
    // Overall Score: [Score] / 10
    // Comments: [Share the overall score of the candidate, consider all the metrics and skills and share a final score out of 10 - If the candidate is not fit for the role give less score and if the candiate is good or can be considered for next rounds give score accordingly]

    // overall candidate score should be in this format
    // ''' overall score here '''
    // `;

    //     const modelResponse = await model.generateContent(candidatePrompt);
    //     const recruiterReposne = await model.generateContent(recruiterResponse);
    //     const overallScore = recruiterReposne.response
    //         .text()
    //         .match(/Overall Score: (\d\/10)/);
    //     console.log(overallScore, "asnaksnaksnkanskanskanknsk");
    //     await ctx.db.interviewDtl.update({
    //         where: { id: 21 },
    //         data: {
    //             candidateSummary: modelResponse.response.text(),
    //             recruiter: recruiterReposne.response.text(),
    //             candidateScore: overallScore![1],
    //         },
    //     });
    // }),
});
