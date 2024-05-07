import React, { Suspense } from "react";
import ServerHeader from "./../_components/ServerHeader";
import { getServerSession } from "next-auth";
import RecruiterView from "./../_components/RecruiterView";
import JobPostView from "./../_components/JobPostView";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";

const Jobs = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <Suspense fallback={<h4>Loading...</h4>}>
                <ServerHeader />
                <div className="max-w-7xl mx-auto">
                    {/* {session?.user.} */}
                    {session?.user &&
                    session?.user?.role === UserRole.RECRUITER ? (
                        <RecruiterView session={session} />
                    ) : (
                        <Suspense>
                            <JobPostView session={session} />
                        </Suspense>
                    )}
                </div>
            </Suspense>
        </div>
    );
};

export default Jobs;
