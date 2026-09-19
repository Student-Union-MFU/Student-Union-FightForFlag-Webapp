"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
    Building2,
    Ellipsis,
    GraduationCap,
    Hash,
    LoaderCircle,
    LogOut,
    Shell,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LoginMenu from "./loginmenu";
import { useAuth } from "../contexts/AuthContext";
import UserProfile from "./userprofile";

const links = [
    { text: "Home", link: "/" },
    { text: "About", link: "/about" },
    { text: "Voting", link: "/voting" },
];

export default function Navbar() {
    const [sidebarActive, setSidebarActive] = useState<boolean>(false);
    const [rendered, setRendered] = useState<boolean>(false);
    const [buttonload, setButtonload] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const { user, loading, logout } = useAuth();

    const handleSidebarOnClick = () => {
        if (!sidebarActive) setRendered(true);
        setSidebarActive(!sidebarActive);
    };

    const handleLogout = () => {
        setButtonload(true);

        setTimeout(() => {
            logout();
            setButtonload(false);
        }, 1000);
    };

    useGSAP(
        () => {
            if (!rendered) return;

            const cards = gsap.utils.toArray<HTMLElement>(
                ".card",
                containerRef.current
            );

            const rotations = [-3, 2, -1.5];

            const tl = gsap.timeline({
                onComplete: () => {
                    if (!sidebarActive) setRendered(false);
                },
            });

            if (sidebarActive) {
                tl.to(backdropRef.current, {
                    opacity: 1,
                    duration: 0.25,
                    ease: "power1.out",
                }).fromTo(
                    cards,
                    {
                        scale: 0.95,
                        y: 16,
                        opacity: 0,
                        rotate: (i: number) => rotations[i] ?? 0,
                    },
                    {
                        scale: 1,
                        y: 0,
                        opacity: 1,
                        rotate: 0,
                        duration: 0.5,
                        ease: "power2.out",
                        stagger: 0.1,
                    }
                );
            } else {
                tl.to(cards, {
                    scale: 0.95,
                    y: 10,
                    opacity: 0,
                    rotate: (i: number) => rotations[i] ?? 0,
                    duration: 0.3,
                    ease: "power2.in",
                    stagger: 0.03,
                }).to(
                    backdropRef.current,
                    {
                        opacity: 0,
                        duration: 0.25,
                        ease: "power1.in",
                    },
                    "-=0.1"
                );
            }
        },
        {
            scope: containerRef,
            dependencies: [sidebarActive, rendered],
        }
    );

    return (
        <header
            className={clsx(
                sidebarActive
                    ? "text-zinc-50 transition-colors duration-100"
                    : "text-zinc-900 duration-400",
                "relative w-full px-4 bg-zinc-100"
            )}
        >
            <nav
                className={clsx(
                    "flex items-center lg:items-end justify-between",
                    "w-full h-30 lg:h-40 mx-auto lg:py-6"
                )}
            >
                <div className={clsx(
                    sidebarActive && "invert-100",
                    "w-40 h-40 pt-4 invert-0 z-30 duration-200"
                )}>
                    <img src="/logo.png" alt="Fight For Flag" className="w-full h-full object-fill" />
                </div>
                <div className="hidden md:flex lg:flex items-center w-auto h-auto text-3xl gap-10">
                    <div className="flex items-center justify-between gap-20">
                        {links.map((e, i) => (
                            <Link href={e.link} key={i}>
                                <p>{e.text}</p>
                            </Link>
                        ))}
                    </div>

                    {user ? <UserProfile /> : <LoginMenu />}
                </div>

                <div className="flex md:hidden lg:hidden w-auto h-12 text-2xl">
                    <button
                        onClick={handleSidebarOnClick}
                        className="
                            flex items-center justify-around size-12
                            rounded-full bg-zinc-900 text-zinc-50
                            group transition-all z-40
                        "
                    >
                        <Ellipsis
                            size={30}
                            className={clsx(
                                sidebarActive && "rotate-90",
                                "rotate-0 transition-all duration-200"
                            )}
                        />
                    </button>

                    {rendered && (
                        <div
                            ref={backdropRef}
                            style={{ opacity: 0 }}
                            className="
                                fixed inset-0 z-20
                                bg-zinc-950
                                overflow-y-auto
                                overscroll-contain
                            "
                            onClick={handleSidebarOnClick}
                        >
                            <div
                                ref={containerRef}
                                onClick={(e) => e.stopPropagation()}
                                className="
                                    w-full min-h-screen
                                    flex flex-col
                                    pt-36
                                    items-center
                                    gap-3
                                    px-4
                                "
                            >
                                <div className="card w-full flex flex-col rounded-xl overflow-hidden bg-zinc-50 divide-y divide-zinc-200 shadow-xl">
                                    {links.map((e, i) => (
                                        <Link
                                            href={e.link}
                                            key={i}
                                            onClick={handleSidebarOnClick}
                                        >
                                            <p className="item px-6 py-4 text-3xl text-zinc-900">
                                                {e.text}
                                            </p>
                                        </Link>
                                    ))}
                                </div>

                                <div className="card w-full rounded-xl overflow-hidden bg-zinc-50 shadow-xl px-5 py-5 flex flex-col gap-1">
                                    <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                                        Made by
                                    </p>

                                    <p className="text-3xl text-zinc-900">
                                        Student Union Developer Team
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        123 University Ave, Chiang Rai
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        contact@studentunion.ac.th
                                    </p>
                                </div>

                                {loading ? (
                                    <div className="card w-full rounded-xl overflow-hidden bg-zinc-100 flex items-center justify-center py-6">
                                        <Shell className="animate-spin size-5 text-zinc-500" />
                                    </div>
                                ) : user ? (
                                    <div className="flex flex-col gap-2 h-auto w-full pb-20">
                                        <div className="card flex flex-col w-full rounded-xl overflow-hidden bg-zinc-100 text-zinc-950 px-5 py-5">
                                            <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase truncate">
                                                {user.name}
                                            </p>

                                            <p className="text-4xl mt-1.5 truncate">
                                                {user.student_id}
                                            </p>

                                            <p className="text-lg mt-1 truncate">
                                                {user.major}
                                            </p>

                                            <p className="text-xs text-zinc-600 mt-0.5 leading-tight truncate">
                                                {user.school}

                                            </p>
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="
                                                card w-full px-4 py-4
                                                flex items-center justify-center
                                                gap-2 text-lg font-medium
                                                bg-zinc-100 rounded-xl
                                                text-zinc-950
                                                hover:text-red-400
                                                transition-colors
                                            "
                                        >
                                            {buttonload ? (
                                                <LoaderCircle className="animate-spin" />
                                            ) : (
                                                <LogOut size={16} />
                                            )}

                                            Log out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="card w-full rounded-xl overflow-hidden flex justify-end">
                                        <LoginMenu />

                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}