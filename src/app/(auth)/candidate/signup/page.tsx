import React from "react";
import CandidateSignupForm from "./CandidateSignupForm";
import { getServerAuthSession } from "@/server/auth";

const CandidateSignup = async () => {
    const session = await getServerAuthSession();
    return (
        <div>
            <CandidateSignupForm session={session} />
        </div>
    );
};

export default CandidateSignup;
