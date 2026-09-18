import { useRef } from "react";
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

export function SchoolCard({ name, schoolCode, voteCount, status, onVote }: SchoolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const initial = getSchoolInitial(name);
  const majorCount = getMajorCount(schoolCode);
  const isOwnSchool = status === "own-school";
  const isVoted = status === "voted";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 16;
    const rotateX = ((y / rect.height) - 0.5) * -16;
    card.style.transform = `rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div style={{ perspective: "800px" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        className={clsx(
          "relative flex flex-col w-full h-110 p-6 rounded-2xl bg-zinc-50 transition-[border-color] duration-150",
          isVoted ? "border-2 border-zinc-600" : "border border-zinc-300",
          isOwnSchool && "opacity-60"
        )}
      >
        {
            isVoted &&
                <span className="absolute -top-3 right-0 px-4 rounded-full bg-zinc-900 text-zinc-50 ">Voted</span>
        }
        <p className="text-xs tracking-wide text-zinc-400 uppercase mb-4">School vote id</p>

        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="size-24 rounded-xl border border-zinc-300 flex items-center justify-center text-3xl font-medium text-zinc-500 shrink-0">
            {initial}
          </div>

          <p className="text-xl font-medium text-zinc-900 text-center line-clamp-2">{name}</p>

          <div className="w-full border-t border-zinc-200 mt-1 pt-3.5 flex justify-between">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">School id</p>
              <p className="text-sm text-zinc-600 text-center">{schoolCode}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">Votes</p>
              <p className="text-sm text-zinc-600 text-center">{voteCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">Majors</p>
              <p className="text-sm text-zinc-600 text-center">{majorCount}</p>
            </div>
          </div>

          {isOwnSchool && (
            <p className="text-sm text-zinc-400 text-center">You can't vote for your own school</p>
          )}
        </div>

        <button
          onClick={onVote}
          disabled={isVoted || isOwnSchool}
          className={clsx(
            "w-full h-12 rounded-lg text-base font-medium mt-4 shrink-0",
            isVoted || isOwnSchool
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
          )}
        >
          {isVoted ? "Voted" : isOwnSchool ? "Your school" : "Vote"}
        </button>
      </div>
    </div>
  );
}