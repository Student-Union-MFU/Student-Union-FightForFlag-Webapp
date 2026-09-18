"use client"

import clsx from "clsx";

export default function LoginMenu() {
    const startGoogleLogin = () => {
        window.location.href = "http://localhost:8000/auth/login";
    };

    const handleLoginOnClick = () => {
        startGoogleLogin()
    }

    return (
        <div
            className="
                relative
            "
        >
            <button
                onClick={handleLoginOnClick}
                className={clsx(
                    "w-40 h-full z-10 px-6 py-3 lg:py-2",
                    "bg-zinc-100 lg:bg-zinc-900 text-zinc-950 lg:text-zinc-50",
                    "hover:bg-zinc-50 hover:text-zinc-900 border-2",
                    "cursor-pointer transition-transform duration-150 ease-in",
                    "rounded-full"
                )}
            >
                <p>Login</p>
            </button>
        </div>
    )
}