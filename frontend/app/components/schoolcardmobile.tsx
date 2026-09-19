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

function isLightColor(color: string): boolean {
    const hex = color.replace("#", "");

    if (hex.length !== 6) {
        return false;
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const luminance =
        (0.299 * r + 0.587 * g + 0.114 * b) /
        255;

    return luminance > 0.7;
}

export function SchoolCardMobile({
    name,
    schoolCode,
    color,
    voteCount,
    status,
    onVote,
    isVoting = false,
}: SchoolCardProps) {
    const initial = getSchoolInitial(name);
    const majorCount = getMajorCount(schoolCode);

    const isOwnSchool = status === "own-school";
    const isVoted = status === "voted";
    const isLight = isLightColor(color);

    const decorativeColor = isLight
        ? "rgba(0,0,0,0.12)"
        : "rgba(255,255,255,0.20)";

    const secondaryDecorativeColor = isLight
        ? "rgba(0,0,0,0.08)"
        : "rgba(255,255,255,0.10)";

    const initialColor = isLight
        ? "rgba(0,0,0,0.12)"
        : "rgba(255,255,255,0.20)";

    const separatorColor = isLight
        ? "rgba(0,0,0,0.10)"
        : "rgba(255,255,255,0.25)";

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
                    className="absolute inset-0"
                    style={{
                        background: isLight
                            ? "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.35) 0%, transparent 32%), radial-gradient(circle at 10% 100%, rgba(0,0,0,0.08) 0%, transparent 45%)"
                            : "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.18) 0%, transparent 32%), radial-gradient(circle at 10% 100%, rgba(0,0,0,0.15) 0%, transparent 45%)",
                    }}
                />

                <div
                    className="absolute -right-8 -top-10 size-32 rounded-full border-[18px]"
                    style={{
                        borderColor: decorativeColor,
                    }}
                />

                <div
                    className="absolute -bottom-14 -left-10 size-36 rounded-full border-[20px]"
                    style={{
                        borderColor:
                            secondaryDecorativeColor,
                    }}
                />

                <span
                    className="pointer-events-none absolute -right-2 -top-7 select-none text-[125px] font-bold leading-none tracking-[-0.12em]"
                    style={{
                        color: initialColor,
                    }}
                    aria-hidden="true"
                >
                    {initial}
                </span>

                <div
                    className="absolute inset-0"
                    style={{
                        background: isLight
                            ? "linear-gradient(to bottom, rgba(0,0,0,0.02), transparent 50%, rgba(0,0,0,0.06))"
                            : "linear-gradient(to bottom, rgba(0,0,0,0.05), transparent 50%, rgba(0,0,0,0.12))",
                    }}
                />

                <span
                    className="absolute left-2.5 top-2.5 flex size-7 items-center justify-center rounded-full text-[9px] font-semibold shadow-sm backdrop-blur"
                    style={{
                        backgroundColor: isLight
                            ? "rgba(0,0,0,0.85)"
                            : "rgba(255,255,255,0.95)",
                        color: isLight
                            ? "#ffffff"
                            : "#52525b",
                    }}
                >
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

                <div
                    className="absolute bottom-2.5 left-2.5 right-2.5 h-px"
                    style={{
                        backgroundColor:
                            separatorColor,
                    }}
                />
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-1 pt-2">
                <p className="line-clamp-2 max-w-full text-center text-[12px] font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-900">
                    {name}
                </p>

                {isOwnSchool ? (
                    <p className="mt-1.5 text-center text-[10px] text-zinc-400">
                        Your school
                    </p>
                ) : (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-zinc-400">
                        <span>
                            {voteCount}{" "}
                            {voteCount === 1
                                ? "vote"
                                : "votes"}
                        </span>

                        <span className="size-1 rounded-full bg-zinc-300" />

                        <span>
                            {majorCount}{" "}
                            {majorCount === 1
                                ? "major"
                                : "majors"}
                        </span>
                    </div>
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
                    "flex h-9 w-full shrink-0 items-center justify-center rounded-[11px] text-[10px] font-medium transition-all duration-200",
                    isVoted ||
                        isOwnSchool ||
                        isVoting
                        ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]"
                )}
            >
                {isVoting ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
                ) : isVoted ? (
                    "Voted"
                ) : isOwnSchool ? (
                    "Your school"
                ) : (
                    "Vote"
                )}
            </button>
        </div>
    );
}