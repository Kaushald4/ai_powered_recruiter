"use client";
import { api } from "@/app/_trpc/client";
import { Recognizer } from "@/components/temp/recognizer";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

// Connect the nodes

const InterviewPage = ({ params }: { params: { interviewId: number } }) => {
    const router = useRouter();
    const interviewApi = api.question.getInterviewQuestions.useQuery(
        {
            interviewId: Number(params.interviewId),
        },
        { enabled: params.interviewId ? true : false }
    );

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const saveTransscriptApi = api.question.saveUserTranscript.useMutation({
        onSettled: () => {
            if (
                currentQuestionIndex <=
                interviewApi.data?.interviewQuestions?.length! - 1
            ) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        },
    });

    const finishInterviewApi = api.question.saveInterviewVideoLink.useMutation({
        onSettled: () => {
            // naviagte to summary page
            console.log("Interview Completed");
            router.replace("/");
        },
    });

    const onNextClick = (
        { transcript, videoUrl }: { transcript: string; videoUrl: string },
        isCompleted: boolean
    ) => {
        console.log(transcript);
        const questionId =
            interviewApi.data?.interviewQuestions[currentQuestionIndex].id;
        const interviewId = interviewApi.data?.id;

        if (isCompleted) {
            finishInterviewApi.mutate({
                interviewId: interviewId!,
                video_link: videoUrl,
                questionId: questionId!,
                transcript,
            });
        } else {
            saveTransscriptApi.mutate({
                transcript: transcript,
                questionId: questionId!,
            });
        }
    };

    return (
        <div className="mx-[50px] mt-5 mb-4">
            <div>
                <p>
                    Q.{currentQuestionIndex + 1}{" "}
                    {
                        interviewApi.data?.interviewQuestions[
                            currentQuestionIndex
                        ]?.title
                    }
                </p>
            </div>

            {/* <Recognizer
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={
                    interviewApi.data?.interviewQuestions.length! - 1
                }
                onNextClick={onNextClick}
            />
            {/* <p>{userTranscript}</p> */}
            <Recognizer
                currentQuestionIndex={currentQuestionIndex}
                onNextClick={onNextClick as any}
                totalQuestions={
                    interviewApi.data?.interviewQuestions.length! - 1
                }
            />
        </div>
    );
};

export default InterviewPage;
