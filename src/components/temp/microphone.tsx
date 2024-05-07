import MicrophoneStream from "microphone-stream";
import React, {
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import axios from "axios";

import { AudioStreamer } from "./audioStreamer";
import { audioBucket } from "./audioBucket";
import { KaldiRecognizer } from "vosk-browser";
import { Button } from "../ui/button";
import InterviewSummaryModal from "@/app/_components/InterviewSummaryModal";

interface Props {
    recognizer: KaldiRecognizer | undefined;
    ready: boolean;
    loading: boolean;
    transcriptRef: MutableRefObject<string[]>;
    // transcript: string[];
    currentQuestionIndex: number;
    totalQuestions: number;
    onNextClick: (
        transcript: { videoUrl: string | null; transcript: string },
        isCompleted: boolean
    ) => void;
}

let micStream: any;
let audioStreamer: AudioStreamer;

const Microphone: React.FunctionComponent<Props> = ({
    recognizer,
    loading,
    ready,
    onNextClick,
    currentQuestionIndex,
    totalQuestions,
    // transcript,
    transcriptRef,
}) => {
    const [muted, setMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [interviewStarted, setInterviewStarted] = useState(false);

    const [screenMediaStream, setScreenMediaStream] = useState<MediaStream>();
    const [videoStream, setVideoStream] = useState<MediaStream>();
    const mediaRecorderRef = useRef<any>();
    const [recordedChunks, setRecordedChunks] = useState<any>([]);
    const [uplaoding, setUploading] = useState<boolean>(false);
    const [uplaodProgress, setUploadProgress] = useState<number>(0);

    const startRecognitionStream = useCallback(async () => {
        if (recognizer) {
            setMuted(true);

            if (!micStream) {
                let mediaStream = null;
                try {
                    mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                        },
                    });
                    setVideoStream(mediaStream);
                    micStream = new MicrophoneStream({
                        objectMode: true,
                        bufferSize: 1024,
                    });
                    if (videoRef.current) {
                        videoRef.current!.srcObject = mediaStream;
                    }
                    micStream.setStream(mediaStream);
                } catch (err) {
                    console.error(err);
                }
            } else {
                micStream.unpipe(audioStreamer);
                micStream.pipe(audioBucket);
            }

            audioStreamer = new AudioStreamer(recognizer, {
                objectMode: true,
            });
        }
    }, [recognizer]);

    const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
            setRecordedChunks((prev: any) => prev.concat(event.data));
        }
    };

    const startRecording = (stream: MediaStream) => {
        const withAdio = new MediaStream([
            stream.getVideoTracks()[0],
            videoStream!.getAudioTracks()[0],
        ]);
        const mediaRecorder = new MediaRecorder(withAdio, {
            mimeType: "video/webm;codecs=h264", // Specify codec for better compatibility and compression
            videoBitsPerSecond: 1 * 50 * 1024, // Adjust bitrate for video compression
            audioBitsPerSecond: 108000,
        });
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(200);
        mediaRecorderRef.current = mediaRecorder;
    };

    const downloadRecording = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                setUploading(true);
                mediaRecorderRef.current.stop();
                const blob = new Blob(recordedChunks, { type: "video/webm" });
                const formData = new FormData();
                formData.append("file", blob);
                formData.append("upload_preset", "ch3nfnxe");
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/dl5cujwyq/video/upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            // Authorization: `Bearer 344196977392439`, //TODO: remove this
                        },
                        withCredentials: false,
                        onUploadProgress: (progressEvent: any) => {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total
                            );
                            setUploadProgress(percentCompleted);
                            // You can update UI with the progress here
                            // For example, setUploadProgress(percentCompleted);
                        },
                    }
                );

                if (response.data) {
                    resolve(response.data.secure_url);
                }
                setUploading(false);
            } catch (error) {
                reject(error);
                setUploading(false);
            }
        });
    };

    useEffect(() => {
        startRecognitionStream();
    }, [recognizer]);

    useEffect(() => {
        setMuted(true);
    }, [loading]);

    useEffect(() => {
        if (!muted) {
            micStream?.unpipe(audioBucket);
            micStream?.pipe(audioStreamer);
        } else {
            micStream?.unpipe(audioStreamer);
            micStream?.pipe(audioBucket);
        }
    }, [muted]);

    const toggleMic = () => {
        setMuted((muted) => !muted);
    };

    const enableScreenSharing = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    audio: true,
                    video: true,
                });
                const dSurface = stream
                    .getVideoTracks()[0]
                    .getSettings().displaySurface;
                if (dSurface !== "monitor") {
                    alert("Please Share your entire screen");
                    reject("Please Share your entire screen");
                    return;
                }
                resolve(stream);
                setScreenMediaStream(stream);
            } catch (error) {
                console.log(error);
            }
        });
    };

    return (
        <div>
            <InterviewSummaryModal show={uplaoding} progress={uplaodProgress} />

            <video
                ref={videoRef}
                muted
                autoPlay
                playsInline
                className=" mt-4 rounded-lg w-[92vw] h-[82vh] object-cover"
            />
            <div className="flex justify-center mt-5">
                <Button
                    disabled={!ready || loading || !muted}
                    onClick={() => {
                        enableScreenSharing()
                            .then((stream: any) => {
                                toggleMic();
                                setInterviewStarted(true);
                                startRecording(stream);
                            })
                            .catch((error) => {
                                console.log(error);
                                setInterviewStarted(false);
                            });
                    }}
                >
                    {muted ? "Record" : "Recording"}
                </Button>
                <div className="flex justify-end ml-auto mr-9">
                    {currentQuestionIndex < totalQuestions ? (
                        <>
                            <Button
                                disabled={!interviewStarted}
                                onClick={() => {
                                    const copyTransscirpt =
                                        transcriptRef.current.join(" ");
                                    onNextClick(
                                        {
                                            transcript: copyTransscirpt,
                                            videoUrl: null,
                                        },
                                        false
                                    );
                                    transcriptRef.current = [];
                                    // toggleMic(true);
                                }}
                            >
                                Next
                            </Button>
                        </>
                    ) : (
                        <Button
                            disabled={!interviewStarted}
                            onClick={() => {
                                downloadRecording().then((vidoeUurl) => {
                                    onNextClick(
                                        {
                                            transcript:
                                                transcriptRef.current.join(" "),
                                            videoUrl: vidoeUurl as string,
                                        },
                                        true
                                    );
                                    transcriptRef.current = [];
                                    setInterviewStarted(false);
                                });
                                // toggleMic(true);
                            }}
                        >
                            Finish
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Microphone;
