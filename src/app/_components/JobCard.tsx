"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { formatJobType } from "../_utils/formatJobType";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/api/root";
import { TRPCClientErrorLike } from "@trpc/client";

type TJobPostReqProps = NonNullable<
    UseTRPCQueryResult<
        inferRouterOutputs<AppRouter>["user"]["getAllJobs"][0],
        TRPCClientErrorLike<AppRouter>
    >["data"]
>;

type TJobPostProps = {
    job: TJobPostReqProps;
    showApplyBtn?: boolean;
    userRole: string | undefined;
    handleApplyJobClick?: (id: number) => void;
    userId?: number;
    handleInterviewReportClick?: (interviewId: number) => void;
    deleteJobPost?: (id: number) => void;
};

const JobCard = ({
    job,
    userRole,
    userId,
    showApplyBtn = false,
    handleApplyJobClick,
    handleInterviewReportClick,
    deleteJobPost,
}: TJobPostProps) => {
    console.log();
    const router = useRouter();

    const isMyInterview = job.InterviewDtl?.findLast((interview) => {
        return interview.userId === Number(userId);
    });

    console.log(isMyInterview, "asnksank");

    return (
        <Card>
            <div className="flex items-center justify-between w-full">
                <div>
                    <CardHeader className="font-semibold w-[70vw]">
                        <div className="flex justify-between w-full">
                            <div>
                                <div className="text-xl">{job.title}</div>
                                <p>{job.companyName}</p>
                            </div>
                            <div className="text-sm text-gray-400">
                                {formatDistanceToNow(job.createdAt, {
                                    addSuffix: true,
                                })}
                            </div>

                            <div>
                                <span className="text-sm">
                                    Experience Level -
                                </span>
                                {formatJobType(job.experienceLevel).map(
                                    (v, i) => {
                                        return (
                                            <p className="mx-1 text-sm" key={i}>
                                                {v}
                                            </p>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {userRole === "RECRUITER" ? (
                            <div className="flex gap-5">
                                <Button
                                    variant={"outline"}
                                    onClick={() => {
                                        router.push(`/job/edit/${job.id}`);
                                    }}
                                >
                                    View / Edit
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (deleteJobPost) {
                                            deleteJobPost(Number(job.id));
                                        }
                                    }}
                                    className="bg-[#ff2359] hover:bg-[#78152e]"
                                >
                                    Delete
                                </Button>

                                <Button
                                    onClick={() => {
                                        router.push(
                                            `/candidateperformance/${job.id}`
                                        );
                                    }}
                                >
                                    View Candidates
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Button
                                    disabled={
                                        job.InterviewDtl.find((interview) => {
                                            return (
                                                interview.userId ===
                                                Number(userId)
                                            );
                                        })
                                            ? true
                                            : false
                                    }
                                    onClick={() => {
                                        if (handleApplyJobClick) {
                                            handleApplyJobClick(job.id);
                                        }
                                    }}
                                >
                                    {job.InterviewDtl.find((interview) => {
                                        return (
                                            interview.userId === Number(userId)
                                        );
                                    })
                                        ? "Already Applied"
                                        : "Apply"}{" "}
                                </Button>
                                {isMyInterview &&
                                    isMyInterview.is_completed && (
                                        <Button
                                            onClick={() => {
                                                if (
                                                    handleInterviewReportClick
                                                ) {
                                                    handleInterviewReportClick(
                                                        Number(isMyInterview.id)
                                                    );
                                                }
                                            }}
                                            variant={"outline"}
                                        >
                                            View Report
                                        </Button>
                                    )}
                            </div>
                        )}
                        {/* <div className="mt-5">
                                            {job.experienceLevel}
                                        </div> */}
                    </CardContent>
                </div>
            </div>
        </Card>
    );
};

export default JobCard;
