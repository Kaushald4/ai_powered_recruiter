/*
  Warnings:

  - You are about to drop the column `video_link` on the `InterviewQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterviewDtl" ADD COLUMN     "video_link" TEXT;

-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "video_link";
