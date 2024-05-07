import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { env } from "@/env";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            role: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    adapter: PrismaAdapter(db) as Adapter,
    providers: [
        CredentialsProvider({
            name: "credential",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials.password) return null;

                try {
                    const user = await db.user.findFirst({
                        where: { email: credentials.email },
                    });

                    if (user) {
                        // Any object returned will be saved in `user` property of the JWT
                        const isValidPassword = await bcrypt.compare(
                            credentials?.password,
                            user.password
                        );
                        if (!isValidPassword) {
                            throw new Error("Invalid Credentials!");
                        }
                        return { ...user, id: String(user.id) };
                    }
                    return null;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            },
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],

    callbacks: {
        async session(params) {
            // Send properties to the client, like an access_token and user id from a provider.

            // session.user.role =
            console.log(params.token, "session token");
            params.session.user = {
                ...params.session.user,
                role: params.token.role as string,
                id: params.token.id as number,
            } as any;
            return params.session;
        },

        async jwt(params: any) {
            if (params.user) {
                params.token.role = params.user.role;
                params.token.id = params.user.id;
            }

            return params.token;
        },
    },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async () => {
    return await getServerSession(authOptions);
};
