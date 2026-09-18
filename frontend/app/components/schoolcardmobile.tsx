import clsx from "clsx";
import { getMajorCount } from "@/app/data/schools";

interface SchoolCardProps {
  name: string;
  schoolCode: string;
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
        `
          group
          relative
          flex
          h-[245px]
          flex-col
          overflow-hidden
          rounded-[22px]
          border
          bg-white
          p-2.5
          transition-all
          duration-300
        `,

        isVoted
          ? `
            border-zinc-800
            shadow-[0_8px_25px_rgba(0,0,0,0.08)]
          `
          : `
            border-zinc-200
            shadow-[0_2px_10px_rgba(0,0,0,0.025)]
            active:scale-[0.985]
          `,

        isOwnSchool && "opacity-55"
      )}
    >
      <div
        className="
          relative
          h-[112px]
          shrink-0
          overflow-hidden
          rounded-[16px]
          bg-zinc-100
        "
      >
        <span
          className="
            pointer-events-none
            absolute
            -right-2
            -top-7
            select-none
            text-[125px]
            font-semibold
            leading-none
            tracking-[-0.12em]
            text-zinc-200
          "
        >
          {initial}
        </span>

        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -bottom-14
            size-32
            rounded-full
            border-[14px]
            border-white/80
          "
        />

        {/* School number */}
        <span
          className="
            absolute
            left-2.5
            top-2.5
            flex
            size-7
            items-center
            justify-center
            rounded-full
            bg-white
            text-[9px]
            font-semibold
            text-zinc-500
            shadow-sm
          "
        >
          {schoolCode}
        </span>

        {/* Voted badge */}
        {isVoted && (
          <span
            className="
              absolute
              right-2.5
              top-2.5
              rounded-full
              bg-zinc-900
              px-2.5
              py-1
              text-[9px]
              font-medium
              text-white
            "
          >
            Voted
          </span>
        )}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
        </div>
      </div>

      <div
        className="
          flex
          min-h-0
          flex-1
          flex-col
          items-center
          justify-center
          px-1
          pt-2
        "
      >
        <p
          className="
            line-clamp-2
            max-w-full
            text-center
            text-[12px]
            font-semibold
            leading-[1.15]
            tracking-[-0.02em]
            text-zinc-900
          "
        >
          {name}
        </p>

        {isOwnSchool ? (
          <p className="mt-1 text-[10px] text-zinc-400">
            Your school
          </p>
        ) : (
          <div
            className="
              mt-1.5
              flex
              items-center
              gap-1.5
              text-[9px]
              text-zinc-400
            "
          >
            <span>
              {voteCount} {voteCount === 1 ? "vote" : "votes"}
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
          `
            h-9
            w-full
            shrink-0
            rounded-[11px]
            text-[10px]
            font-medium
            transition-all
            duration-200
          `,

          isVoted || isOwnSchool
            ? `4
              cursor-not-allowed
              bg-zinc-100
              text-zinc-400
            `
            : `
              bg-zinc-900
              text-white
              hover:bg-zinc-800
              active:scale-[0.98]
            `
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