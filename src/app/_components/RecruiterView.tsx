"use client";
import { Session } from "next-auth";
import React from "react";
import { api } from "../_trpc/client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import JobCard from "./JobCard";

type TRecruiterViewProps = {
    session: Session;
};

const RecruiterView = ({ session }: TRecruiterViewProps) => {
    const router = useRouter();
    const jobPostApi = api.user.getMyPostedJobList.useQuery();
    const deleteJobPostApi = api.user.deleteJobPost.useMutation({
        onSettled: () => {
            jobPostApi.refetch();
        },
    });

    const deleteJobPost = (id: number) => {
        deleteJobPostApi.mutate({ jobPostId: id });
    };

    return (
        <div className="w-full">
            <h4 className="text-4xl text-primary font-bold">My Listings</h4>
            <div className="flex flex-col gap-4 mt-14">
                {jobPostApi.data?.map((job: any) => {
                    return (
                        <JobCard
                            userRole={session.user.role}
                            key={job.id}
                            job={job}
                            deleteJobPost={deleteJobPost}
                        />
                    );
                })}
            </div>
            {jobPostApi.data?.length === 0 && (
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

export default RecruiterView;
