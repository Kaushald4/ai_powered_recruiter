"use client";
import { api } from "@/app/_trpc/client";
import { Session } from "next-auth";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewReportModal from "@/app/_components/InterviewReportModal";

type CandidatePerformanceProps = {
    session: Session | null;
    jobId: number;
};
const CandidatePerformance = ({
    session,
    jobId,
}: CandidatePerformanceProps) => {
    const [interviewDetails, setInterviewDetails] = useState<{
        interviewId: null | number;
        userName: string | null;
    } | null>(null);
    const interviewReportApi = api.question.getMyInterviewReport.useQuery(
        { interviewId: Number(interviewDetails?.interviewId) },
        { enabled: interviewDetails ? true : false }
    );

    const candidateDetails = api.user.getJobDetailsById.useQuery(
        { jobId },
        { enabled: jobId ? true : false }
    );

    const handleInterviewReportClick = (
        interview_id: number,
        userName: string
    ) => {
        setInterviewDetails({ interviewId: interview_id, userName: userName });
    };
    const closeInterviewReportModal = () => {
        setInterviewDetails(null);
    };

    console.log(interviewReportApi.data?.recruiter);
    return (
        <div>
            <h4 className="text-4xl mb-14">Candidates List</h4>

            <InterviewReportModal
                interviewReport={interviewReportApi.data?.recruiter!}
                show={interviewDetails ? true : false}
                closeInterviewReportModal={closeInterviewReportModal}
                candidateName={interviewDetails?.userName!}
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Video Link</TableHead>
                        <TableHead>Summary & Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {candidateDetails.data?.InterviewDtl?.map((userDetail) => (
                        <TableRow key={userDetail?.user?.id}>
                            <TableCell className="font-medium">
                                {userDetail.id}
                            </TableCell>
                            <TableCell>{userDetail?.user?.name}</TableCell>
                            <TableCell>{userDetail?.user?.email}</TableCell>
                            <TableCell>
                                {userDetail?.video_link ? (
                                    <Link href={userDetail?.video_link!}>
                                        Download
                                    </Link>
                                ) : (
                                    "N/A"
                                )}
                            </TableCell>
                            <TableCell>
                                {userDetail.candidateSummary ? (
                                    <Button
                                        onClick={() => {
                                            handleInterviewReportClick(
                                                userDetail.id,
                                                userDetail.user.name
                                            );
                                        }}
                                    >
                                        View
                                    </Button>
                                ) : (
                                    "N/A"
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CandidatePerformance;
