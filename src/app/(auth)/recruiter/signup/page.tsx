import React from "react";
import SignupForm from "./SignupForm";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";

const SignupPage = async () => {
    const session = await getServerAuthSession();
    if (session) redirect("/");
    return (
        <div>
            <SignupForm />
        </div>
    );
};

export default SignupPage;
