"use client";

import { useEffect, useState } from "react";
import Container from "../components/container";
import { MasonryGrid } from "../components/mansory";
import { SchoolCard } from "../components/schoolcard";
import { useAuth } from "../contexts/AuthContext";
import { SCHOOLS, School } from "@/app/data/schools";
import { SchoolCardMobile } from "../components/schoolcardmobile";
import { Lock } from "lucide-react";

interface VoteCountResponse {
    school_id: number;
    school_code: string;
    school_name: string;
    vote_count: number;
    color: string;
}

export default function VotingPage() {
    const { user, voteStatus, refetch } = useAuth();

    const [votedSchool, setVotedSchool] = useState<string | null>(null);
    const [schools, setSchools] = useState<School[]>(SCHOOLS);
    const [votingSchool, setVotingSchool] = useState<string | null>(null);

    const handleFetch = async () => {
        try {
            const res = await fetch(
                "/api/backend/votes/counts",
                {
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                console.error("Failed to fetch vote counts");
                return;
            }

            const data: VoteCountResponse[] = await res.json();

            const merged = SCHOOLS.map((school) => {
                const match = data.find(
                    (count) =>
                        count.school_code === school.code
                );

                return {
                    ...school,
                    voteCount:
                        match?.vote_count ??
                        school.voteCount,
                };
            });

            setSchools(merged);
        } catch (error) {
            console.error(
                "Fetching vote counts failed:",
                error
            );
        }
    };

    const handleVote = async (code: string) => {
        if (!user || votedSchool || votingSchool) {
            return;
        }

        setVotingSchool(code);

        try {
            const res = await fetch(
                `/api/backend/votes/${code}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.detail || "Failed to cast vote"
                );
            }

            setVotedSchool(code);

            await handleFetch();

            await refetch();
        } catch (error) {
            console.error("Vote failed:", error);
        } finally {
            setVotingSchool(null);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    useEffect(() => {
        if (voteStatus?.voted_school_code) {
            setVotedSchool(
                voteStatus.voted_school_code
            );
        }
    }, [voteStatus?.voted_school_code]);

    return (
        <main className="flex h-full w-full flex-col items-center bg-zinc-100">
            <Container
                className="
                    flex
                    h-fit
                    min-h-[70dvh]
                    w-full
                    flex-col
                    gap-12
                    py-10
                    sm:gap-14
                    lg:gap-20
                    lg:py-20
                "
            >
                <div className="w-full">
                    <div className="flex flex-col gap-5 lg:gap-7">
                        <div className="flex items-center gap-3">
                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    tracking-[0.16em]
                                    text-zinc-500
                                    lg:text-xs
                                "
                            >
                                FIGHT FOR FLAG26
                            </span>
                        </div>

                        <h1
                            className="
                                max-w-4xl
                                text-[clamp(3.2rem,12vw,5rem)]
                                font-medium
                                leading-[0.88]
                                tracking-[-0.065em]
                                text-zinc-900
                                lg:text-[clamp(5rem,8vw,8rem)]
                            "
                        >
                            Vote For Your
                            <br />
                            <span className="text-zinc-400">
                                Favourite School
                            </span>
                        </h1>

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                lg:flex-row
                                lg:items-end
                                lg:justify-between
                            "
                        >
                            <p
                                className="
                                    max-w-85
                                    text-sm
                                    leading-relaxed
                                    text-zinc-500
                                    lg:max-w-lg
                                    lg:text-base
                                "
                            >
                                Choose the school you want to represent
                                and cast your vote for Fight For Flag 26.
                            </p>

                            {!user && (
                                <button
                                    className="
                                        w-fit
                                        rounded-full
                                        bg-zinc-900
                                        px-5
                                        py-2.5
                                        text-xs
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-zinc-800
                                        active:scale-[0.98]
                                    "
                                >
                                    Log in to vote
                                </button>
                            )}
                        </div>

                        <div className="h-px w-full bg-zinc-200" />
                    </div>
                </div>

                {user ? (
                    <>
                        <div
                            className="
                                grid
                                w-full
                                grid-cols-2
                                gap-3
                                sm:gap-4
                                lg:hidden
                            "
                        >
                            {schools.map((school) => (
                                <SchoolCardMobile
                                    key={school.id}
                                    name={school.name}
                                    voteCount={
                                        school.voteCount ?? 0
                                    }
                                    status={
                                        user.school === school.name
                                            ? "own-school"
                                            : votedSchool ===
                                                school.code
                                              ? "voted"
                                              : "default"
                                    }
                                    schoolCode={school.code}
                                    onVote={() =>
                                        handleVote(
                                            school.code
                                        )
                                    }
                                    color={school.color}
                                />
                            ))}
                        </div>

                        <MasonryGrid className="hidden lg:grid">
                            {schools.map((school) => (
                                <SchoolCard
                                    key={school.id}
                                    name={school.name}
                                    voteCount={
                                        school.voteCount ?? 0
                                    }
                                    status={
                                        user.school === school.name
                                            ? "own-school"
                                            : votedSchool ===
                                                school.code
                                              ? "voted"
                                              : "default"
                                    }
                                    schoolCode={school.code}
                                    onVote={() =>
                                        handleVote(
                                            school.code
                                        )
                                    }
                                    color={school.color}
                                />
                            ))}
                        </MasonryGrid>
                    </>
                ) : (
                    <div className="flex h-full grow items-center justify-center">
                        <Lock size={35} />
                    </div>
                )}
            </Container>
        </main>
    );
}