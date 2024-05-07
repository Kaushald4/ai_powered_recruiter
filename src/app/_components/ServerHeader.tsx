import { getServerSession } from "next-auth";
import React from "react";
import Header from "./Header";
import { authOptions } from "@/server/auth";

const ServerHeader = async () => {
    const session = await getServerSession(authOptions);

    return <Header session={session} />;
};

export default ServerHeader;
