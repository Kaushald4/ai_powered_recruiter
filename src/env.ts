import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        JWT_SECRET: z.string(),
        JWT_EXPIRE: z.string(),
        COOKIE_EXPIRE: z.string(),
        NEXTAUTH_SECRET: z.string(),
        LLM_API_KEY: z.string(),
    },

    clientPrefix: "PUBLIC_",
    client: {},

    runtimeEnv: process.env,

    skipValidation: !!process.env.SKIP_ENV_VALIDATION,

    emptyStringAsUndefined: true,
});
