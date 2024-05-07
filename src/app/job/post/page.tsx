import React from "react";
import JobPostForm from "./JobPostForm";
import { getServerSession } from "next-auth";

const PostJobPage = async () => {
  const session = await getServerSession();
  return (
    <div>
      <JobPostForm session={session} />
    </div>
  );
};

export default PostJobPage;
