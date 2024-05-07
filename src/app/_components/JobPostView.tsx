"use client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { api } from "../_trpc/client";
import JobCard from "./JobCard";
import Image from "next/image";
import JobModel from "./JobModel";
import InterviewReportModal from "./InterviewReportModal";
import { Tabs } from "@/components/ui/tabs";

type TJobPostViewProps = {
    session: Session | null;
};

const JobPostView = ({ session }: TJobPostViewProps) => {
    const userApi = api.user.getAllJobs.useQuery();
    const [openApplyModel, setOpenApplyModel] = useState<number | null>(null);
    const [interviewId, setInterviewId] = useState<number | null>(null);
    const interviewReportApi = api.question.getMyInterviewReport.useQuery(
        { interviewId: Number(interviewId) },
        { enabled: interviewId ? true : false }
    );

    const handleApplyJobClick = (jobId: number) => {
        setOpenApplyModel(jobId);
    };

    const closeApplyModel = () => {
        setOpenApplyModel(null);
    };

    const handleInterviewReportClick = (interview_id: number) => {
        setInterviewId(interview_id);
    };
    const closeInterviewReportModal = () => {
        setInterviewId(null);
    };

    const tabs = [
        {
            title: "All Jobs",
            value: "alljobs",
            content: (
                <div className="w-full overflow-y-auto relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
                    <div className="mt-14 flex flex-col gap-5">
                        {userApi.data?.map((job) => {
                            return (
                                <JobCard
                                    userRole={session?.user?.role}
                                    showApplyBtn
                                    job={job}
                                    key={job.id}
                                    handleApplyJobClick={handleApplyJobClick}
                                    userId={session?.user.id}
                                    handleInterviewReportClick={
                                        handleInterviewReportClick
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            ),
        },
        {
            title: "Applied Jobs",
            value: "appliedjobs",
            content: (
                <div className="w-full overflow-y-auto relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
                    <div className="mt-14 flex flex-col gap-5">
                        {userApi.data
                            ?.filter((u) =>
                                u.InterviewDtl.findLast(
                                    (u) => u.userId === Number(session?.user.id)
                                )
                            )
                            .map((job) => {
                                return (
                                    <JobCard
                                        userRole={session?.user?.role}
                                        showApplyBtn
                                        job={job}
                                        key={job.id}
                                        handleApplyJobClick={
                                            handleApplyJobClick
                                        }
                                        userId={session?.user.id}
                                        handleInterviewReportClick={
                                            handleInterviewReportClick
                                        }
                                    />
                                );
                            })}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div>
            <JobModel
                closeApplyModel={closeApplyModel}
                jobId={openApplyModel}
            />
            <InterviewReportModal
                interviewReport={interviewReportApi.data?.candidateSummary!}
                show={interviewId ? true : false}
                closeInterviewReportModal={closeInterviewReportModal}
            />
            {userApi.data && userApi.data.length >= 1 && (
                <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col  w-full mt-8  items-start justify-start ">
                    <Tabs tabs={tabs} />
                </div>
            )}
            {userApi.data?.length === 0 && (
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-full flex flex-col items-center justify-center">
                        <Image
                            src="/no-data.svg"
                            alt="image"
                            height={200}
                            width={200}
                        />
                        <div className="w-full text-center ml-8 mt-4">
                            No Job Posted
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPostView;
