-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "interviewDtlId" INTEGER,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewDtl" (
    "id" SERIAL NOT NULL,
    "jobPostId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "InterviewDtl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_interviewDtlId_fkey" FOREIGN KEY ("interviewDtlId") REFERENCES "InterviewDtl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewDtl" ADD CONSTRAINT "InterviewDtl_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewDtl" ADD CONSTRAINT "InterviewDtl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
