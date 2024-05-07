import { CandidateSignupReqSchema, SignupReqSchema } from "@/types/auth";
import { router, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@prisma/client";

export const authRouter = router({
    signup: publicProcedure
        .input(SignupReqSchema)
        .mutation(async ({ ctx, input }) => {
            const { email, name, password } = input;
            if (!(email || name || password))
                throw new Error("Missing Input Fields!");

            let user = await ctx.db.user.findFirst({ where: { email } });
            if (user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Email Already Exist!",
                });
            }
            const hashedPassword = await hash(password, 10);

            console.log(hashedPassword, "asmaksmaksmakmskamsk");
            await ctx.db.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name,
                    role: UserRole.RECRUITER,
                },
            });
            return {
                message: "Signup Successfull",
            };
        }),

    candidateSignup: publicProcedure
        .input(CandidateSignupReqSchema)
        .mutation(async ({ ctx, input }) => {
            const { email, name, password } = input;
            if (!(email || name || password))
                throw new Error("Missing Input Fields!");

            let user = await ctx.db.user.findFirst({ where: { email } });

            if (user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Email Already Exist!",
                });
            }
            const hashedPassword = await hash(password, 10);
            await ctx.db.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name,
                    role: UserRole.CANDIDATE,
                },
            });
            return {
                message: "Signup Successfull",
            };
        }),

    profile: protectedProcedure.query(async ({ ctx, input }) => {
        const user = await ctx.db.user.findFirst({
            where: { email: ctx.session.user.email! },
        });
        return user;
    }),
});
