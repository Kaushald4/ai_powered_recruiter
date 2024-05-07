import React from "react";
import LoginForm from "./LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await getServerSession();
  if (session) redirect("/");
  return <LoginForm />;
};

export default LoginPage;
