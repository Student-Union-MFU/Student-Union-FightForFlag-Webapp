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
  if (!endTime) return "—";

  const difference = new Date(endTime).getTime() - Date.now();

  if (difference <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Home() {
  const [voting, setVoting] = useState<VotingStatus | null>(null);
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft("2026-09-19T18:00:00Z"));

  useEffect(() => {
    const getVotingStatus = async () => {
      try {
        const response = await fetch("/api/backend/voting/status");

        if (!response.ok) {
          throw new Error("Failed to fetch voting status");
        }

        const data: VotingStatus = await response.json();

        setVoting(data);
        setTimeLeft(formatTimeLeft(data.ends_at));
      } catch (error) {
        console.error("Failed to fetch voting status:", error);
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
          flex-row
          items-center
          gap-4
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
            h-full
            w-full
            flex-col
            items-center
            justify-center
            text-xl
            lg:text-3xl
          "
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-4
                text-7xl
                lg:text-9xl
              "
            >
              <div>
                {votingOpen ? 
                  <p className="text-base lg:text-xl">
                    Voting Closes in
                  </p>
                  :
                  <p className="text-center text-6xl">
                    Voting Closed
                  </p> 
                }
              </div>

              {
                votingOpen && 
                  <p>{timeLeft}</p>
              }
            </div>

            <p className="flex items-center justify-center w-50 text-center text-base lg:w-xl">
              {votingOpen
                ? "Cast your vote before voting closes."
                : "Thank you for participating in the event"}
            </p>

            {votingOpen && (
              <Link
                href="/voting"
                className="relative z-20"
              >
                <div
                  className="
                    h-full
                    w-fit
                    cursor-pointer
                    rounded-full
                    border-4
                    border-transparent
                    bg-zinc-900
                    px-10
                    py-3
                    text-zinc-50
                    transition-all
                    hover:border-zinc-900
                    hover:bg-zinc-50
                    hover:text-zinc-900
                  "
                >
                  <p>Vote Now</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}