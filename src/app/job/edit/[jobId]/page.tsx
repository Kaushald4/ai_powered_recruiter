import { getServerSession } from "next-auth";
import React from "react";
import EditJobPostForm from "./EditJobForm";

const EditJob = async ({ params }: { params: { jobId: number } }) => {
    const session = await getServerSession();
    const jobId = params.jobId;

    return (
        <div>
            <EditJobPostForm session={session} jobId={jobId} />
        </div>
    );
};

export default EditJob;
