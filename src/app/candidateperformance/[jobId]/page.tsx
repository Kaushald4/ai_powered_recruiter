import React, { Suspense } from "react";
import ServerHeader from "../../_components/ServerHeader";
import { getServerAuthSession } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import CandidatePerformance from "./CandidatePerformance";

const CandidatePerformace = async ({
    params,
}: {
    params: { jobId: number };
}) => {
    const session = await getServerAuthSession();
    if (session?.user.role !== UserRole.RECRUITER) {
        redirect("/");
    }
    return (
        <Suspense fallback={<h4>Loading...</h4>}>
            <ServerHeader />
            <div className="max-w-7xl mx-auto">
                <CandidatePerformance
                    jobId={Number(params.jobId)}
                    session={session}
                />
            </div>
        </Suspense>
    );
};

export default CandidatePerformace;
