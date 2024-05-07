import { createCallerFactory, router } from "@/server/api/trpc";
// import { userRouter } from "@/server/api/routes/user";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { getServerSession } from "next-auth";
import { db } from "../db";
import { questionRouter } from "./routes/question";

export const appRouter = router({
    //   user: userRouter,
    auth: authRouter,
    user: userRouter,
    question: questionRouter,
});

export type AppRouter = typeof appRouter;

// 1. create a caller-function for your router
const createCaller = createCallerFactory(appRouter);

// 2. create a caller using your `Context`

// Fetch the session and create a caller using the session context
export async function getCaller() {
    const session = await getServerSession();
    const caller = createCaller({ session: session, db: db });
    return caller;
}
