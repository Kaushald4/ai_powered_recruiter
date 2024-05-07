import React, { MutableRefObject, useEffect, useRef, useState } from "react";

import { createModel, KaldiRecognizer, Model } from "vosk-browser";
import Microphone from "./microphone";

interface VoskResult {
    result: Array<{
        conf: number;
        start: number;
        end: number;
        word: string;
    }>;
    text: string;
}

type TRecoginer = {
    onNextClick: (
        transcript: { videoUrl: string | null; transcript: string },
        isCompleted: boolean
    ) => void;

    currentQuestionIndex: number;
    totalQuestions: number;
};

export const Recognizer = ({
    currentQuestionIndex,
    onNextClick,
    totalQuestions,
}: TRecoginer) => {
    const [utterances, setUtterances] = useState<VoskResult[]>([]);
    const [partial, setPartial] = useState("");
    const [loadedModel, setLoadedModel] = useState<{
        model: Model;
        path: string;
    }>();
    const [recognizer, setRecognizer] = useState<KaldiRecognizer>();
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);

    const textRef = useRef<string[]>([]);

    const loadModel = async (path: string) => {
        setLoading(true);
        loadedModel?.model.terminate();

        const model = await createModel(path);

        setLoadedModel({ model, path });
        const recognizer = new model.KaldiRecognizer(48000);
        recognizer.setWords(true);
        recognizer.on("result", (message: any) => {
            const result: VoskResult = message.result;
            textRef.current.push(result.text);
            console.log(result.text);
            // setUtterances((utt: VoskResult[]) => [...utt, result]);
        });

        recognizer.on("partialresult", (message: any) => {
            setPartial(message.result.partial);
        });

        setRecognizer(() => {
            setLoading(false);
            setReady(true);
            return recognizer;
        });
    };

    useEffect(() => {
        loadModel("/vosk-model-small-en-in-0.4.zip");
    }, []);

    return (
        <div>
            <div>
                {/* {utterances.map((utt, uindex) =>
                    utt?.result?.map((word, windex) => (
                        <div key={`${uindex}-${windex}`}>{word.word} </div>
                    ))
                )}
                <span key="partial">{partial}</span> */}

                <Microphone
                    loading={loading}
                    ready={ready}
                    recognizer={recognizer}
                    onNextClick={onNextClick}
                    transcriptRef={textRef}
                    // transcript={}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={totalQuestions}
                />
            </div>
        </div>
    );
};
