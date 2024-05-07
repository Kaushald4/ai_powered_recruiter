"use client";
import { api } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const InterviewInstruction = ({ params }: { params: { jobId: number } }) => {
    const router = useRouter();
    const questionApi = api.question.generateQuestion.useMutation({
        onSettled: (data: any) => {
            router.push(`/interview/start/${data.id}`);
        },
    });

    return (
        <div className="max-w-7xl mx-auto">
            <h4 className="font-bold my-8 text-2xl">
                Welcome to the Screening Round Interview! Before we begin,
                please take a moment to review the following instructions.
            </h4>
            <p>
                <span className="font-bold">
                    Screening Round Interview Overview:
                </span>
                <span>
                    This screening round interview is designed to assess your
                    qualifications and suitability for the role. Based on your
                    experience and the requirements mentioned by the recruiter,
                    a series of questions will be asked, and you will have to
                    answer them.
                </span>
                <br />
                <br />
                <span className="font-bold">Question Format: </span>
                <span>
                    You will be presented with questions related to your
                    background, skills, and experience. Your responses will help
                    us evaluate your fit for the position.
                </span>
                <br />
                <br />

                <span className="font-bold">Post-Interview Summary: </span>
                <span>
                    Right after the interview, you will receive a summary of
                    your responses and an evaluation of the screening round.
                    This will provide you with feedback on how you performed.{" "}
                </span>

                <br />
                <br />

                <span className="font-bold">Next Steps: </span>
                <span>
                    Based on your performance in the screening round, HR will
                    reach out to you for further rounds of interviews. Please
                    ensure you perform to the best of your abilities to maximize
                    your chances of moving forward in the hiring process.
                </span>

                <br />
                <br />
                <span className="font-bold"> Technical Considerations: </span>
                <span>
                    Before we begin, please ensure that your device&apos;s
                    camera, microphone, and internet connection are working
                    properly. Also, find a quiet and well-lit space for the
                    interview to minimize distractions.
                </span>
                <br />
                <br />

                <span className="font-bold">
                    Engagement and Communication:{" "}
                </span>
                <span>
                    Maintain eye contact with the camera, speak clearly and
                    confidently, and actively engage with the interviewer
                    throughout the interview. This helps create a positive
                    impression. Follow Instructions and Stay Positive: Follow
                    the interviewer&apos;s instructions carefully and stay
                    positive and enthusiastic throughout the interview. Relax,
                    be yourself, and let your personality shine through.
                </span>
            </p>

            <div className="mt-8">
                <Button
                    onClick={() => {
                        questionApi.mutate({ jodId: Number(params.jobId) });
                    }}
                >
                    Start Interview
                </Button>
            </div>
        </div>
    );
};

export default InterviewInstruction;
