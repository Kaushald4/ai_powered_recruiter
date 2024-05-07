"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    CandidateSignupReqSchema,
    TCadidateReq,
    TSignupReq,
} from "@/types/auth";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { api } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Session } from "next-auth";

type CandidateSignupFormProps = {
    session: Session | null;
};

const CandidateSignupForm = ({ session }: CandidateSignupFormProps) => {
    const signupApi = api.auth.candidateSignup.useMutation({
        onSettled: () => {
            router.push("/login");
        },
    });
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { isLoading, isSubmitting, errors },
    } = useForm<TCadidateReq>({
        resolver: zodResolver(CandidateSignupReqSchema),
    });

    const onSubmit: SubmitHandler<TCadidateReq> = (data) => {
        signupApi.mutate(data);
        toast.success("Signup Success");
    };

    return (
        <div>
            <Card className="max-w-[500px] mx-auto mt-20">
                <CardHeader>
                    <h4 className="text-4xl">Create Account</h4>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-2">
                            <Input
                                {...register("name")}
                                className={`${
                                    errors.name?.message
                                        ? "border-red-500"
                                        : "border-balck-500"
                                }`}
                                placeholder="Name"
                            />
                            {errors.name?.message && (
                                <ErrorMessage message={errors.name.message} />
                            )}
                            <Input
                                className={`${
                                    errors.email?.message
                                        ? "border-red-500"
                                        : "border-balck-500"
                                }`}
                                {...register("email")}
                                placeholder="Email"
                            />
                            {errors.email?.message && (
                                <ErrorMessage message={errors.email.message} />
                            )}

                            <Input
                                className={`${
                                    errors.password?.message
                                        ? "border-red-500"
                                        : "border-balck-500"
                                }`}
                                {...register("password")}
                                placeholder="Password"
                            />
                            {errors.password?.message && (
                                <ErrorMessage
                                    message={errors.password.message}
                                />
                            )}
                            <Input
                                className={`${
                                    errors.confirmPassword?.message
                                        ? "border-red-500"
                                        : "border-balck-500"
                                }`}
                                {...register("confirmPassword")}
                                placeholder="Confirm Password"
                            />
                            {errors.confirmPassword?.message && (
                                <ErrorMessage
                                    message={errors.confirmPassword.message}
                                />
                            )}
                        </div>
                        <div className="my-4" />
                        <Button type="submit" className="w-full">
                            Signup
                        </Button>

                        <p className="text-center mt-7">
                            Already have an account ?{" "}
                            <Link href="/login">Login</Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CandidateSignupForm;
