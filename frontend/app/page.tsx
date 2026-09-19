"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "./components/container";
import VerticalCardMarquee from "./components/marquee";

interface VotingStatus {
    id: number;
    is_open: boolean;
    starts_at: string | null;
    ends_at: string | null;
}

function formatTimeLeft(endTime: string | null) {
    if (!endTime) return "00:00:00";

    const difference =
        new Date(endTime).getTime() - Date.now();

    if (difference <= 0) {
        return "00:00:00";
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        return `${days}d ${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(hours).padStart(2, "0")}:${String(
        minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Home() {
    const [voting, setVoting] = useState<VotingStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState("00:00:00");

    useEffect(() => {
        const getVotingStatus = async () => {
            try {
                const response = await fetch(
                    "/api/backend/voting/status",
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch voting status"
                    );
                }

                const data: VotingStatus =
                    await response.json();

                setVoting(data);
                setTimeLeft(formatTimeLeft(data.ends_at));
            } catch (error) {
                console.error(
                    "Failed to fetch voting status:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        getVotingStatus();
    }, []);

    useEffect(() => {
        if (!voting?.ends_at || !voting.is_open) return;

        const interval = setInterval(() => {
            setTimeLeft(formatTimeLeft(voting.ends_at));
        }, 1000);

        return () => clearInterval(interval);
    }, [voting]);

    const votingOpen = voting?.is_open === true;

    return (
        <main className="flex flex-1 flex-col items-center justify-center">
            <Container
                className="
                    relative
                    flex
                    min-h-[75dvh]
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                "
            >
                <div className="absolute inset-0 z-0">
                    <VerticalCardMarquee />
                </div>

                <div
                    className="
                        relative
                        z-10
                        flex
                        min-h-[75dvh]
                        w-full
                        flex-col
                        items-center
                        justify-center
                        text-xl
                        lg:text-3xl
                    "
                >
                    <div className="flex flex-col items-center">
                        {loading ? (
                            <div className="flex flex-col items-center">
                                <div
                                    className="
                                        h-5
                                        w-28
                                        animate-pulse
                                        rounded-full
                                        bg-zinc-900/10
                                        lg:h-6
                                        lg:w-36
                                    "
                                />

                                <div
                                    className="
                                        mt-4
                                        h-20
                                        w-64
                                        animate-pulse
                                        rounded-2xl
                                        bg-zinc-900/10
                                        lg:h-28
                                        lg:w-96
                                    "
                                />

                                <div
                                    className="
                                        mt-5
                                        h-4
                                        w-48
                                        animate-pulse
                                        rounded-full
                                        bg-zinc-900/10
                                        lg:h-5
                                        lg:w-64
                                    "
                                />

                                <div
                                    className="
                                        mt-6
                                        h-12
                                        w-32
                                        animate-pulse
                                        rounded-full
                                        bg-zinc-900/10
                                    "
                                />
                            </div>
                        ) : votingOpen ? (
                            <>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 lg:text-base">
                                    Voting closes in
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-6xl
                                        font-medium
                                        tracking-[-0.06em]
                                        text-zinc-950
                                        tabular-nums
                                        lg:text-9xl
                                    "
                                >
                                    {timeLeft}
                                </p>

                                <p className="mt-4 w-64 text-center text-sm text-zinc-500 lg:w-xl lg:text-base">
                                    Cast your vote before voting closes.
                                </p>

                                <Link
                                    href="/voting"
                                    className="
                                        relative
                                        z-20
                                        mt-7
                                    "
                                >
                                    <div
                                        className="
                                            rounded-full
                                            border-2
                                            border-zinc-900
                                            bg-zinc-900
                                            px-9
                                            py-3
                                            text-base
                                            font-medium
                                            text-zinc-50
                                            transition-all
                                            duration-200
                                            hover:bg-zinc-50
                                            hover:text-zinc-900
                                            active:scale-95
                                        "
                                    >
                                        Vote Now
                                    </div>
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400 lg:text-base">
                                    Voting
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-6xl
                                        font-medium
                                        tracking-[-0.06em]
                                        text-zinc-950
                                        lg:text-9xl
                                    "
                                >
                                    Closed
                                </p>

                                <p className="mt-4 w-64 text-center text-sm text-zinc-500 lg:w-xl lg:text-base">
                                    Thank you for participating in the event.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </main>
    );
}