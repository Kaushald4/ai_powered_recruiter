"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUpdateUserReq, UpdateUserSchema } from "@/types/user";
import { api } from "../_trpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type TModelProps = {
    jobId: number | null;
    closeApplyModel: () => void;
};

const JobModel = ({ jobId, closeApplyModel }: TModelProps) => {
    const { register, handleSubmit, setValue } = useForm<TUpdateUserReq>({
        resolver: zodResolver(UpdateUserSchema),
    });
    const router = useRouter();

    const userApi = api.user.profile.useQuery();
    const updateProfileApi = api.user.updateUser.useMutation({
        onSettled: () => {
            toast.success("Profile Saved");
            router.push(`/interview/instructions/${jobId}`);
        },
    });

    useEffect(() => {
        if (userApi.data) {
            setValue("name", userApi.data.name);
            setValue("email", userApi.data.email);
            setValue("phoneNumber", userApi.data.phoneNumber || "");
            setValue("yoe", userApi.data.yoe || "");
        }
    }, [userApi.data]);

    const onSubmit: SubmitHandler<TUpdateUserReq> = (data) => {
        updateProfileApi.mutate(data);
    };

    return (
        <Dialog
            open={jobId ? true : false}
            onOpenChange={(open) => {
                if (open === false) {
                    closeApplyModel();
                }
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Apply</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label>Full Name</Label>
                        <Input {...register("name")} placeholder="Full Name" />

                        <Label>Email</Label>
                        <Input {...register("email")} placeholder="Email" />

                        <Label>Phone Number</Label>
                        <Input
                            {...register("phoneNumber")}
                            placeholder="Phone Number"
                        />

                        <Label>Year of experience</Label>
                        <Input
                            {...register("yoe")}
                            placeholder="YOE"
                            type="number"
                        />

                        <input type="file" hidden id="cv" />
                        <label
                            htmlFor="cv"
                            className="flex cursor-pointer justify-center flex-col items-center border border-dotted border-gray-500 rounded-md p-4  w-full"
                        >
                            <Image
                                src="/upload.svg"
                                alt="image"
                                width={100}
                                height={70}
                            />
                            <p className="mt-2 font-semibold text-sm">
                                Upload CV
                            </p>
                        </label>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Next</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default JobModel;
