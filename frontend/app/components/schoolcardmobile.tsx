import clsx from "clsx";
import { getMajorCount } from "@/app/data/schools";

interface SchoolCardProps {
    name: string;
    schoolCode: string;
    color: string;
    voteCount: number;
    status: "default" | "voted" | "own-school";
    onVote?: () => void;
}

function getSchoolInitial(name: string): string {
    const trimmed = name.trim();
    const withoutPrefix = trimmed.replace(/^school of\s+/i, "");
    return (withoutPrefix || trimmed).charAt(0).toUpperCase();
}

export function SchoolCardMobile({
    name,
    schoolCode,
    color,
    voteCount,
    status,
    onVote,
}: SchoolCardProps) {
    const initial = getSchoolInitial(name);
    const majorCount = getMajorCount(schoolCode);
    const isOwnSchool = status === "own-school";
    const isVoted = status === "voted";

    return (
        <div
            className={clsx(
                "group relative flex h-61.25 flex-col overflow-hidden rounded-[22px] border bg-white p-2.5 transition-all duration-300",
                isVoted
                    ? "border-zinc-800 shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
                    : "border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.025)] active:scale-[0.985]",
                isOwnSchool && "opacity-55"
            )}
        >
            <div
                className="relative h-28 shrink-0 overflow-hidden rounded-2xl"
                style={{
                    backgroundColor: color,
                }}
            >
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `radial-gradient(circle at 85% 15%, white 0%, transparent 32%), radial-gradient(circle at 10% 100%, black 0%, transparent 45%)`,
                    }}
                />

                <div
                    className="absolute -right-8 -top-10 size-32 rounded-full border-[18px] border-white/20"
                />

                <div
                    className="absolute -bottom-14 -left-10 size-36 rounded-full border-[20px] border-white/10"
                />

                <span
                    className="pointer-events-none absolute -right-2 -top-7 select-none text-[125px] font-bold leading-none tracking-[-0.12em] text-white/20"
                    aria-hidden="true"
                >
                    {initial}
                </span>

                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />

                <span className="absolute left-2.5 top-2.5 flex size-7 items-center justify-center rounded-full bg-white/95 text-[9px] font-semibold text-zinc-600 shadow-sm backdrop-blur">
                    {schoolCode}
                </span>

                {isVoted && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-zinc-900/90 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur">
                        Voted
                    </span>
                )}

                {isOwnSchool && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-medium text-zinc-600 backdrop-blur">
                        Your school
                    </span>
                )}

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <div className="h-px w-full bg-white/25" />
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-1 pt-3">
                <p className="line-clamp-2 text-center text-[12px] font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-900">
                    {name}
                </p>

                {isOwnSchool ? (
                    <p className="mt-1.5 text-center text-[10px] text-zinc-400">
                        You cannot vote for your own school
                    </p>
                ) : (
                    <div className="mt-2 flex items-center justify-center gap-2 text-[9px] text-zinc-400">
                        <span>
                            {voteCount}{" "}
                            {voteCount === 1 ? "vote" : "votes"}
                        </span>

                        <span className="size-1 rounded-full bg-zinc-300" />

                        <span>
                            {majorCount}{" "}
                            {majorCount === 1 ? "major" : "majors"}
                        </span>
                    </div>
                )}
            </div>

            <button
                onClick={onVote}
                disabled={isVoted || isOwnSchool}
                className={clsx(
                    "h-9 w-full shrink-0 rounded-[11px] text-[10px] font-medium transition-all duration-200",
                    isVoted || isOwnSchool
                        ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]"
                )}
            >
                {isVoted
                    ? "Voted"
                    : isOwnSchool
                      ? "Your school"
                      : "Vote"}
            </button>
        </div>
    );
}