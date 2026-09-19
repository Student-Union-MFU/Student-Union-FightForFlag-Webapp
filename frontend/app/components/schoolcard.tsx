import { useRef } from "react";
import clsx from "clsx";
import { getMajorCount } from "@/app/data/schools";

interface SchoolCardProps {
    name: string;
    schoolCode: string;
    color: string;
    voteCount: number;
    status: "default" | "voted" | "own-school";
    onVote?: () => void;
    isVoting?: boolean;
}

function getSchoolInitial(name: string): string {
    const trimmed = name.trim();
    const withoutPrefix = trimmed.replace(
        /^school of\s+/i,
        ""
    );

    return (withoutPrefix || trimmed)
        .charAt(0)
        .toUpperCase();
}

export function SchoolCard({
    name,
    schoolCode,
    color,
    voteCount,
    status,
    onVote,
    isVoting = false,
}: SchoolCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const initial = getSchoolInitial(name);
    const majorCount = getMajorCount(schoolCode);

    const isOwnSchool = status === "own-school";
    const isVoted = status === "voted";

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        const card = cardRef.current;

        if (!card) return;

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY =
            (x / rect.width - 0.5) * 16;

        const rotateX =
            (y / rect.height - 0.5) * -16;

        card.style.transform = `rotateX(${rotateX.toFixed(
            1
        )}deg) rotateY(${rotateY.toFixed(
            1
        )}deg) scale(1.03)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;

        if (!card) return;

        card.style.transform =
            "rotateX(0deg) rotateY(0deg) scale(1)";
    };

    return (
        <div style={{ perspective: "800px" }}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                }}
                className={clsx(
                    "relative flex h-110 w-full flex-col rounded-2xl bg-zinc-50 p-6 transition-[border-color] duration-150",
                    isVoted
                        ? "border-2 border-zinc-600"
                        : "border border-zinc-300",
                    isOwnSchool && "opacity-60"
                )}
            >
                {isVoted && (
                    <span className="absolute -top-3 right-0 rounded-full bg-zinc-900 px-4 text-zinc-50">
                        Voted
                    </span>
                )}

                <p className="mb-4 text-xs uppercase tracking-wide text-zinc-400">
                    School vote id
                </p>

                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                    <div
                        className="flex size-24 shrink-0 items-center justify-center rounded-xl text-3xl font-medium text-white shadow-sm"
                        style={{
                            backgroundColor: color,
                        }}
                    >
                        {initial}
                    </div>

                    <p className="line-clamp-2 text-center text-xl font-medium text-zinc-900">
                        {name}
                    </p>

                    <div className="mt-1 flex w-full justify-between border-t border-zinc-200 pt-3.5">
                        <div>
                            <p className="mb-1 text-[10px] uppercase tracking-wide text-zinc-400">
                                School id
                            </p>

                            <p className="text-center text-sm text-zinc-600">
                                {schoolCode}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-[10px] uppercase tracking-wide text-zinc-400">
                                Votes
                            </p>

                            <p className="text-center text-sm text-zinc-600">
                                {voteCount}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-[10px] uppercase tracking-wide text-zinc-400">
                                Majors
                            </p>

                            <p className="text-center text-sm text-zinc-600">
                                {majorCount}
                            </p>
                        </div>
                    </div>

                    {isOwnSchool && (
                        <p className="text-center text-sm text-zinc-400">
                            You can't vote for your own school
                        </p>
                    )}
                </div>

                <button
                    onClick={onVote}
                    disabled={
                        isVoted ||
                        isOwnSchool ||
                        isVoting
                    }
                    className={clsx(
                        "mt-4 flex h-12 w-full shrink-0 items-center justify-center rounded-lg text-base font-medium",
                        isVoted ||
                            isOwnSchool ||
                            isVoting
                            ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                            : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                    )}
                >
                    {isVoting ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-700" />
                    ) : isVoted ? (
                        "Voted"
                    ) : isOwnSchool ? (
                        "Your school"
                    ) : (
                        "Vote"
                    )}
                </button>
            </div>
        </div>
    );
}