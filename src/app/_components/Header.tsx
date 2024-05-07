"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { api } from "../_trpc/client";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { UserRole } from "@prisma/client";
import Image from "next/image";

type TSession = {
    session: Session | null;
};

const Header = ({ session }: TSession) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="flex items-center h-[60px] mx-[50px]">
            <div>
                <h4 className="font-bold text-2xl text-primary">RecruitAI</h4>
            </div>
            <div className="ml-auto flex items-center gap-5">
                {pathname === "/" && (
                    <Button
                        className={cn(buttonVariants())}
                        onClick={() => {
                            router.push("/jobs");
                        }}
                    >
                        All Jobs
                    </Button>
                )}
                {(!session?.user ||
                    session?.user?.role === UserRole.RECRUITER) && (
                    <Button
                        className={cn(buttonVariants())}
                        onClick={() => {
                            if (session?.user?.email) {
                                // page
                                router.push("/job/post");
                            } else {
                                // signsing
                                router.push("/recruiter/signup");
                            }
                        }}
                    >
                        Post a Job
                    </Button>
                )}

                {!session?.user?.email ? (
                    <>
                        <Button
                            onClick={() => {
                                if (!session?.user) {
                                    router.push("/candidate/signup");
                                }
                            }}
                        >
                            Apply Now
                        </Button>
                        <Button
                            onClick={() => {
                                if (!session?.user) {
                                    router.push("/login");
                                }
                            }}
                        >
                            Login
                        </Button>
                    </>
                ) : (
                    <Button onClick={() => signOut({ callbackUrl: "/" })}>
                        Logout
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Header;
