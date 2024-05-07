import { CircleX } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";

type InterviewReportModalProps = {
    interviewReport: string;
    show: boolean;
    candidateName?: string;
    closeInterviewReportModal: () => void;
};

const InterviewReportModal = ({
    interviewReport,
    show,
    closeInterviewReportModal,
    candidateName,
}: InterviewReportModalProps) => {
    if (show) {
        return (
            <div className="absolute inset-0 z-50 bg-[rgba(0,0,0,.7)]">
                <div className="bg-[white] rounded-xl mx-auto max-w-[700px] px-8 mt-8 p-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-2xl">
                            {candidateName ? candidateName : "Your"} Interview
                            Report
                        </h4>
                        <CircleX
                            onClick={() => {
                                closeInterviewReportModal();
                            }}
                            className="cursor-pointer"
                        />
                    </div>
                    <Markdown className="mt-5">{interviewReport}</Markdown>
                </div>
            </div>
        );
    }
    return <div />;
};

export default InterviewReportModal;
