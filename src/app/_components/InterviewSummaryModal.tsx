"use client";

import { Progress } from "@/components/ui/progress";
import React from "react";

type TInterviewSummaryModalProps = {
    show: boolean;
    progress: number;
};

const InterviewSummaryModal = ({
    show,
    progress,
}: TInterviewSummaryModalProps) => {
    if (show) {
        return (
            <div className="absolute inset-0 z-50 bg-[rgba(0,0,0,.7)]">
                <div className="bg-[white] rounded-xl mx-auto max-w-[700px] px-8 mt-8 p-4">
                    <div>
                        <h4 className="text-2xl">Thanks</h4>
                    </div>
                    <div className="mt-7">
                        We are processing your response please do not close this
                        popup. It will take few minutes
                    </div>

                    <div className="mt-5">
                        <Progress value={progress} />
                    </div>
                </div>
            </div>
        );
    } else {
        return <div />;
    }
};

export default InterviewSummaryModal;
