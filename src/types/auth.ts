import { z } from "zod";

export const SignupReqSchema = z
    .object({
        name: z.string().min(1),
        email: z.string().email(),
        companyName: z.string().min(4),
        companyWebsite: z.string().url().min(4),
        password: z.string().min(4),
        confirmPassword: z.string().min(4),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
            });
        }
    });

export type TSignupReq = z.infer<typeof SignupReqSchema>;

export const CandidateSignupReqSchema = z
    .object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(4),
        confirmPassword: z.string().min(4),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
            });
        }
    });

export type TCadidateReq = z.infer<typeof CandidateSignupReqSchema>;
