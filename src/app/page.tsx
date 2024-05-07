import Link from "next/link";
import { CardContent, Card } from "@/components/ui/card";
import ServerHeader from "./_components/ServerHeader";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";

function BotIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6c63ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </svg>
    );
}

function MountainIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6c63ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    );
}

function SmartphoneIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6c63ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
        </svg>
    );
}

function VideoIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6c63ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
        </svg>
    );
}

export default function Component() {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <ServerHeader />
            <main className="flex-1">
                <section className="w-full py-14">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2 max-w-[820px]">
                                    <TextGenerateEffect
                                        words="Seamless hiring with RecruitAI 90% time
                                        saved, 100% efficiency"
                                    >
                                        {/* <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
                                        Seamless hiring with RekrutAI - 90% time
                                        saved, 100% efficiency gained.
                                    </h1> */}
                                    </TextGenerateEffect>

                                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                        Elevate your hiring with RecruitAI live
                                        interviews, real-time analysis, and top
                                        talent, all while saving time
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row"></div>
                            </div>
                            <Image
                                alt="Hero"
                                className="mx-auto overflow-hidden rounded-xl object-cover"
                                height={250}
                                src="/main.svg"
                                width={450}
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 border-t">
                    <div className="container grid items-center gap-6 px-4 md:px-6">
                        <div className="space-y-4 text-center md:space-y-0 md:text-left">
                            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-5">
                                Features
                            </h2>
                            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                Our platform includes a range of features to
                                streamline the hiring process.
                            </p>
                        </div>
                        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <BotIcon className="w-20 h-20" />
                                <div className="space-y-2 text-center">
                                    <h3 className="font-bold">
                                        Automated Screening
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Let the AI handle the initial resume
                                        review.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <SmartphoneIcon className="w-20 h-20" />
                                <div className="space-y-2 text-center">
                                    <h3 className="font-bold">
                                        Instant Feedback
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Get Feedback Right After the Interview
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <VideoIcon className="w-20 h-20" />
                                <div className="space-y-2 text-center">
                                    <h3 className="font-bold">
                                        Video Interviews
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Conduct interviews remotely with our
                                        platform.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    © 2024 Hire AI. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link
                        className="text-xs hover:underline underline-offset-4"
                        href="#"
                    >
                        About
                    </Link>
                    <Link
                        className="text-xs hover:underline underline-offset-4"
                        href="#"
                    >
                        Privacy
                    </Link>
                    <Link
                        className="text-xs hover:underline underline-offset-4"
                        href="#"
                    >
                        Contact
                    </Link>
                </nav>
            </footer>
        </div>
    );
}

function BriefcaseIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#6c63ff"
            stroke="#6c63ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}
