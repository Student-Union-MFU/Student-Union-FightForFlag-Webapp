"use client";

import { useEffect, useMemo, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface SchoolVote {
    school_id: number;
    school_name: string;
    color: string;
    school_code: string;
    vote_count: number;
}

interface Dashboard {
    voting_open: boolean;
    total_users: number;
    total_votes: number;
    users_not_voted: number;
    schools: SchoolVote[];
}

function DonutChart({ schools, total }: { schools: SchoolVote[]; total: number }) {
    const segments = useMemo(() => {
        if (total === 0) return [];

        let current = 0;

        return schools
            .filter((school) => school.vote_count > 0)
            .map((school) => {
                const percentage = (school.vote_count / total) * 100;
                const start = current;
                current += percentage;

                return {
                    ...school,
                    start,
                    end: current,
                };
            });
    }, [schools, total]);

    const gradient =
        total === 0
            ? "#e4e4e7 0% 100%"
            : segments
                  .map(
                      (segment) =>
                          `${segment.color} ${segment.start}% ${segment.end}%`
                  )
                  .join(", ");

    return (
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-center">
            <div
                className="relative lg:right-25 size-56 shrink-0 rounded-full"
                style={{
                    background: `conic-gradient(${gradient})`,
                }}
            >
                <div className="absolute bg-zinc-50 inset-7 flex flex-col items-center justify-center rounded-full ">
                    <span className="text-3xl font-bold">
                        {total}
                    </span>
                    <span className="text-sm text-zinc-500">
                        Total Votes
                    </span>
                </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-1 gap-3">
                {schools.map((school) => {
                    const percentage =
                        total > 0
                            ? (school.vote_count / total) * 100
                            : 0;

                    return (
                        <div
                            key={school.school_id}
                            className="flex items-center justify-between gap-3"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <span
                                    className="size-3 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor: school.color,
                                    }}
                                />

                                <span className="truncate text-sm">
                                    {school.school_name}
                                </span>
                            </div>

                            <span className="shrink-0 text-xs text-zinc-500">
                                {percentage.toFixed(1)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const getDashboard = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/admin/dashboard`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch dashboard");
            }

            const data: Dashboard = await response.json();
            setDashboard(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboard();
    }, []);

    const toggleVoting = async () => {
        if (!dashboard) return;

        setUpdating(true);

        try {
            const response = await fetch(
                `${backendUrl}/admin/voting`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        is_open: !dashboard.voting_open,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update voting status"
                );
            }

            await getDashboard();
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
                <div className="text-sm text-zinc-500">
                    Loading dashboard...
                </div>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
                <div className="text-center">
                    <p className="font-medium">
                        Failed to load dashboard.
                    </p>
                    <button
                        onClick={getDashboard}
                        className="mt-4 rounded-full bg-zinc-900 px-5 py-2.5 text-sm text-white"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    const maxVotes = Math.max(
        ...dashboard.schools.map((school) => school.vote_count),
        1
    );

    return (
        <main className="min-h-screen bg-zinc-100">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <header className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-zinc-500 sm:text-base">
                            Fight For Flag 2026
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div
                            className={`w-fit rounded-full px-4 py-2 text-center text-sm font-semibold ${
                                dashboard.voting_open
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {dashboard.voting_open
                                ? "Voting Open"
                                : "Voting Closed"}
                        </div>

                        <button
                            onClick={toggleVoting}
                            disabled={updating}
                            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {updating
                                ? "Updating..."
                                : dashboard.voting_open
                                  ? "Close Voting"
                                  : "Open Voting"}
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm text-zinc-500">
                            Registered Users
                        </p>

                        <p className="mt-2 text-3xl font-bold sm:text-4xl">
                            {dashboard.total_users}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm text-zinc-500">
                            Total Votes
                        </p>

                        <p className="mt-2 text-3xl font-bold sm:text-4xl">
                            {dashboard.total_votes}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6 sm:col-span-2 lg:col-span-1">
                        <p className="text-sm text-zinc-500">
                            Haven't Voted
                        </p>

                        <p className="mt-2 text-3xl font-bold sm:text-4xl">
                            {dashboard.users_not_voted}
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold sm:text-2xl">
                            Vote Distribution
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Overall distribution of votes by school
                        </p>
                    </div>

                    <DonutChart

                        schools={dashboard.schools}
                        total={dashboard.total_votes}
                    />
                </section>

                <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold sm:text-2xl">
                            Votes by School
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Current vote count for each school
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        {dashboard.schools.map((school) => {
                            const percentage =
                                dashboard.total_votes > 0
                                    ? (school.vote_count /
                                          dashboard.total_votes) *
                                      100
                                    : 0;

                            const barWidth =
                                (school.vote_count / maxVotes) * 100;

                            return (
                                <div
                                    key={school.school_id}
                                    className="flex flex-col gap-2"
                                >
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div
                                                className="size-3 shrink-0 rounded-full sm:size-4"
                                                style={{
                                                    backgroundColor:
                                                        school.color,
                                                }}
                                            />

                                            <span className="truncate text-sm font-medium sm:text-base">
                                                {school.school_name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 pl-6 sm:pl-0">
                                            <span className="text-xs text-zinc-500 sm:text-sm">
                                                {school.vote_count} votes
                                            </span>

                                            <span className="w-12 text-right text-xs text-zinc-400">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${barWidth}%`,
                                                backgroundColor:
                                                    school.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}