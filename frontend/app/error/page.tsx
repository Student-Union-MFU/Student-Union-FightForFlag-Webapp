"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, MailX } from "lucide-react";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");

    const isInvalidAccount = reason === "invalid-account";

    return (
        <main className="flex min-h-[80dvh] w-full items-center justify-center bg-zinc-100 px-5">
            <div className="flex w-full max-w-md flex-col items-center text-center">
                <div className="mb-7 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    {isInvalidAccount ? (
                        <MailX
                            size={28}
                            strokeWidth={1.5}
                            className="text-zinc-500"
                        />
                    ) : (
                        <AlertCircle
                            size={28}
                            strokeWidth={1.5}
                            className="text-zinc-500"
                        />
                    )}
                </div>

                <span className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-zinc-400">
                    {isInvalidAccount
                        ? "ACCOUNT NOT SUPPORTED"
                        : "AUTHENTICATION ERROR"}
                </span>

                <h1 className="text-3xl font-medium tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                    {isInvalidAccount
                        ? "MFU account required"
                        : "Something went wrong"}
                </h1>

                <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
                    {isInvalidAccount
                        ? "Please sign in using your MFU Lamduan student account to access Fight For Flag 26."
                        : "We couldn't complete your sign-in. Please try again or return to the home page."}
                </p>

                <Link
                    href="/"
                    className="
                        mt-8
                        flex
                        h-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-zinc-900
                        px-7
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-zinc-800
                        active:scale-[0.98]
                    "
                >
                    Back to home
                </Link>
            </div>
        </main>
    );
}