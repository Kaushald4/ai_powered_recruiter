"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type TLogin = z.infer<typeof LoginSchema>;

const LoginForm = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm<TLogin>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit: SubmitHandler<TLogin> = async (data) => {
        try {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
            });
            console.log(res?.error);
            if (res?.ok) {
                router.replace("/jobs");
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="">
            <Card className="mx-auto mt-[50px] max-w-[400px] rounded-lg px-5 py-4">
                <CardHeader>
                    <h2 className="text-4xl">Welcome Back</h2>
                    <h4>Login</h4>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-5 flex flex-col gap-2"
                    >
                        <Input
                            {...register("email")}
                            type="email"
                            autoComplete="email"
                            placeholder="email"
                            className="w-full"
                        />
                        <Input
                            className="w-full"
                            {...register("password")}
                            type="password"
                            placeholder="password"
                        />
                        <Button className="mt-2 w-full" type="submit">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginForm;
