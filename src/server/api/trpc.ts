import { TRPCError, initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { db } from "../db";
import superjson from "superjson";
import { Session, getServerSession } from "next-auth";
import { getServerAuthSession } from "../auth";

interface CreateContextOptions {
    session: Session | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        db,
    };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;

    // Get the session from the server using the getServerSession wrapper function

    // this line is throwing error
    // const session = await getServerAuthSession({ req, res });

    const session = await getServerSession();

    return createInnerTRPCContext({
        session,
    });
};

export const t = initTRPC
    .context<typeof createTRPCContext>()
    .create({ transformer: superjson });

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const user = await ctx.db.user.findFirst({
        where: { email: ctx.session.user.email! },
    });
    // console.log(user, "user");

    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: {
                ...ctx.session,
                user: { ...ctx.session.user, id: user!.id, role: user!.role },
            },
        },
    });
});
