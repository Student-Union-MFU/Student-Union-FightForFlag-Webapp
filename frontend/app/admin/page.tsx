"use client";

import { useEffect, useState } from "react";

interface SchoolVote {
    school_id: number;
    school_name: string;
    color: string;
    votes: number;
}

interface Dashboard {
    voting_open: boolean;
    total_users: number;
    total_votes: number;
    users_not_voted: number;
    schools: SchoolVote[];
}

export default function AdminPage() {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const getDashboard = async () => {
        try {
            const response = await fetch(
                "/api/backend/admin/dashboard",
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
                "/api/backend/admin/voting",
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
                throw new Error("Failed to update voting status");
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
            <main className="flex min-h-screen items-center justify-center bg-zinc-100">
                Loading...
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-100">
                Failed to load dashboard.
            </main>
        );
    }

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 bg-zinc-100">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-zinc-500">
                        Fight For Flag 2026
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
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
                        className="rounded-full bg-zinc-900 px-6 py-3 text-zinc-50 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {updating
                            ? "Updating..."
                            : dashboard.voting_open
                              ? "Close Voting"
                              : "Open Voting"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border p-6">
                    <p className="text-sm text-zinc-500">
                        Registered Users
                    </p>

                    <p className="mt-2 text-4xl font-bold">
                        {dashboard.total_users}
                    </p>
                </div>

                <div className="rounded-2xl border p-6">
                    <p className="text-sm text-zinc-500">
                        Total Votes
                    </p>

                    <p className="mt-2 text-4xl font-bold">
                        {dashboard.total_votes}
                    </p>
                </div>

                <div className="rounded-2xl border p-6">
                    <p className="text-sm text-zinc-500">
                        Haven't Voted
                    </p>

                    <p className="mt-2 text-4xl font-bold">
                        {dashboard.users_not_voted}
                    </p>
                </div>
            </div>

            <section className="rounded-2xl border p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">
                        Votes by School
                    </h2>

                    <p className="text-sm text-zinc-500">
                        Current vote distribution
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {dashboard.schools.map((school) => {
                        const percentage =
                            dashboard.total_votes > 0
                                ? (school.votes /
                                      dashboard.total_votes) *
                                  100
                                : 0;

                        return (
                            <div
                                key={school.school_id}
                                className="flex flex-col gap-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="size-4 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    school.color,
                                            }}
                                        />

                                        <span className="font-medium">
                                            {school.school_name}
                                        </span>
                                    </div>

                                    <span className="text-sm text-zinc-500">
                                        {school.votes} votes
                                    </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor:
                                                school.color,
                                        }}
                                    />
                                </div>

                                <span className="text-right text-xs text-zinc-400">
                                    {percentage.toFixed(1)}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}