"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import Select from "react-select";

import dynamic from "next/dynamic";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { api } from "@/app/_trpc/client";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { JobPostSchema, TJobPost } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CustomEditor = dynamic(
    () => {
        return import("../../../_components/CKEditor");
    },
    { ssr: false }
);

type TSession = {
    session: Session | null;
    jobId: number;
};

const TQuestion = z.optional(
    z.object({
        title: z.string(),
    })
);
const EditJobPostForm = ({ session, jobId }: TSession) => {
    const jobDetailsApi = api.user.getJobDetailsById.useQuery({
        jobId: Number(jobId),
    });

    const router = useRouter();
    const userApi = api.user.updateJobDetail.useMutation({
        onSettled: () => {
            toast.success("Job Post Updated");
            router.replace("/");
        },
    });

    const [customQuestions, setCustomQuestions] = useState<any[]>([]);
    const [showAddInput, setshowAddInput] = useState(false);
    const [question, setQuestion] = useState<string>("");
    const [selectedGenerationMode, setselectedGenerationMode] = useState("");

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        control,
    } = useForm<TJobPost>({ resolver: zodResolver(JobPostSchema) });

    useEffect(() => {
        if (jobDetailsApi.data) {
            const experienceLevel = jobDetailsApi.data.experienceLevel
                .split(",")
                .map((exp) => {
                    return {
                        value: exp,
                        label: exp,
                        title: exp,
                    };
                });
            console.log(experienceLevel);
            setValue("title", jobDetailsApi.data.title);
            setValue("experienceLevel", experienceLevel as any);
            setValue("location", jobDetailsApi.data.location);
            setValue(
                "totalQuestions",
                String(jobDetailsApi.data.totalQuestions)
            );
            setValue("questionGenMode", jobDetailsApi.data.questionGenMode);
            setselectedGenerationMode(jobDetailsApi.data.questionGenMode);

            setCustomQuestions(jobDetailsApi.data.questions);
            setValue("jobDetails", jobDetailsApi.data.jobDetails);
        }
    }, [jobDetailsApi.data]);

    const options = [
        { value: "internship", label: "Internship" },
        { value: "entrylevel", label: "Entry Level" },
        { value: "associate", label: "Associate" },
        { value: "mid-seniorlevel", label: "Mid-Senior Level" },
        { value: "director", label: "Director" },
        { value: "executive", label: "Executive" },
    ];

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(e.currentTarget.value);
    };

    const handleAddQuestion = () => {
        setCustomQuestions((prev) => {
            return [
                ...prev,
                {
                    title: question,
                },
            ];
        });

        setQuestion("");
        setshowAddInput(true);
    };

    const handleJobPost: SubmitHandler<TJobPost> = async (data) => {
        userApi.mutate({
            ...data,
            jobid: Number(jobId),
            questions: customQuestions,
        });
    };

    console.log(errors);
    return (
        <div>
            <Card className="max-w-[800px] mx-auto">
                <CardHeader>
                    <div className="flex justify-between ">
                        <h2 className="text-4xl">Post a job</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleJobPost)}>
                        <div className="flex flex-col gap-2">
                            <Input
                                {...register("title")}
                                placeholder="Job Title"
                            />
                            <Input
                                {...register("location")}
                                placeholder="Location"
                            />
                            <Controller
                                name="experienceLevel"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        placeholder="Experience"
                                        className="rounded-sm"
                                        isMulti
                                        value={value?.map((v) => {
                                            return {
                                                label: v.title,
                                                value: v.title,
                                            };
                                        })}
                                        onChange={(val) => {
                                            const transfomedValue = val.map(
                                                (v) => {
                                                    return { title: v.value };
                                                }
                                            );
                                            onChange(transfomedValue);
                                            console.log(transfomedValue);
                                        }}
                                        options={options}
                                    />
                                )}
                                rules={{ required: true }}
                            />

                            <div className="mb-4">
                                <p className="my-2">Generate Questions</p>

                                <div className="flex gap-6">
                                    <Card
                                        onClick={() => {
                                            setselectedGenerationMode("ai");
                                            setCustomQuestions([]);
                                            setValue("questionGenMode", "ai");
                                        }}
                                        className={`p-4 text-sm cursor-pointer ${
                                            selectedGenerationMode === "ai"
                                                ? "bg-black text-white"
                                                : "transparent"
                                        }`}
                                    >
                                        Through AI
                                    </Card>
                                    <Card
                                        onClick={() => {
                                            setselectedGenerationMode("custom");
                                            setCustomQuestions([]);
                                            setValue(
                                                "questionGenMode",
                                                "custom"
                                            );
                                        }}
                                        className={`p-4 text-sm cursor-pointer ${
                                            selectedGenerationMode === "custom"
                                                ? "bg-black text-white"
                                                : "transparent"
                                        }`}
                                    >
                                        Custom Questions
                                    </Card>
                                </div>

                                {selectedGenerationMode === "ai" && (
                                    <Controller
                                        name="totalQuestions"
                                        control={control}
                                        render={({
                                            field: { onChange, value },
                                        }) => {
                                            console.log(value, "value");
                                            return (
                                                <Select
                                                    placeholder="Select number of questions"
                                                    className="rounded-sm mt-7"
                                                    onChange={(val: any) => {
                                                        onChange(
                                                            String(val?.value)
                                                        );
                                                    }}
                                                    value={{
                                                        label: value,
                                                        value: value,
                                                    }}
                                                    options={new Array(10)
                                                        .fill(0)
                                                        .map((_, index) => {
                                                            return {
                                                                label:
                                                                    index + 1,
                                                                value:
                                                                    index + 1,
                                                            };
                                                        })}
                                                />
                                            );
                                        }}
                                        rules={{ required: true }}
                                    />
                                )}

                                <div className="mt-6">
                                    {customQuestions.map((quiz, i) => {
                                        return (
                                            <div key={i}>
                                                Q.{i + 1} {quiz.title}
                                            </div>
                                        );
                                    })}
                                    <div className="flex flex-col gap-4 ">
                                        {selectedGenerationMode ===
                                            "custom" && (
                                            <>
                                                <Input
                                                    placeholder="Question"
                                                    value={question}
                                                    onChange={handleOnChange}
                                                />
                                                <Button
                                                    variant={"outline"}
                                                    onClick={handleAddQuestion}
                                                    type="button"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add More
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Controller
                                name="jobDetails"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CustomEditor
                                        onChange={(value: string) => {
                                            onChange(value);
                                        }}
                                        initialData={value}
                                        placeholder="Enter Job Details"
                                    />
                                )}
                                rules={{ required: true }}
                            />
                        </div>
                        <div className="mt-7">
                            <Button type="submit" className="w-full">
                                Update Post
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditJobPostForm;