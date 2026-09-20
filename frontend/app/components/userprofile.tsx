import { Building2, GraduationCap, Hash, LoaderCircle, LogOut, Shell } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useRef, useState } from "react"
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CARD_STYLE = "bg-zinc-900 rounded-2xl px-7 py-6";
const ICON_BADGE = "size-11 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0";

export default function UserProfile() {
    const [profileActive, setProfileActive] = useState<boolean>(false);
    const [buttonLoad, setButtonLoad] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const loading = useAuth().loading;
    const handleProfileClick = () => {
        if (!profileActive) setMounted(true);
        setProfileActive((prev) => !prev);
    }
 
    const handleLogout = () => {
        setButtonLoad(true);

        setTimeout(() => {
            logout();
            setButtonLoad(false);
        }, 1000);
    };   

    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".profile-card", containerRef.current);
        const rotations = [-3, 2, -1.5]; // one per card, in render order

        if (profileActive) {
            gsap.fromTo(
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
                    duration: 0.3,
                    ease: "power2.out",
                    stagger: 0.05,
                }
            );
        } else {
            gsap.to(cards, {
                scale: 0.95,
                y: 10,
                opacity: 0,
                rotate: (i: number) => rotations[i] ?? 0,
                duration: 0.2,
                ease: "power2.in",
                stagger: 0.03,
                onComplete: () => setMounted(false),
            });
        }
    }, {
        dependencies: [profileActive],
        scope: containerRef,
    });

    return (
        <div className="relative z-20">
            <button onClick={handleProfileClick} className="
                flex items-center justify-center rounded-full 
                w-full h-full px-6 py-1  border-4 border-transparent
                bg-zinc-900 text-zinc-50 font-medium
                hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-950 duration-200">
                {user ? "Profile" : "Login"}
            </button>

            {mounted && (
                <div
                    ref={containerRef}
                    className={clsx(
                        "absolute top-14 right-0 w-96",
                        "flex flex-col gap-2",
                        profileActive ? "pointer-events-auto" : "pointer-events-none"
                    )}
                >
                    {loading ? (
                        <div className={clsx(CARD_STYLE, "flex items-center justify-center py-10")}>
                            <Shell className="animate-spin size-7 text-zinc-500" />
                        </div>
                    ) : user ? (
                        <>
                            <div className={clsx(CARD_STYLE, "profile-card opacity-0 scale-95 flex items-center gap-4")}>
                                <div className="size-14 rounded-xl bg-zinc-800 flex items-center justify-center text-xl font-medium text-zinc-200 shrink-0">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xl font-medium text-zinc-50 leading-tight truncate">{user.name}</p>
                                    <p className="text-base text-zinc-500 mt-1 truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>

                            <div className={clsx(CARD_STYLE, "profile-card opacity-0 scale-95 flex flex-col gap-5")}>
                                <div className="flex items-center gap-4">
                                    <div className={ICON_BADGE}>
                                        <Building2 strokeWidth={2} className="size-5 text-zinc-400" />
                                    </div>
                                    <span className="text-lg text-zinc-300">{user.school}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={ICON_BADGE}>
                                        <GraduationCap strokeWidth={2} className="size-5 text-zinc-400" />
                                    </div>
                                    <span className="text-lg text-zinc-300">{user.major}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={ICON_BADGE}>
                                        <Hash strokeWidth={2} className="size-5 text-zinc-400" />
                                    </div>
                                    <span className="text-lg text-zinc-300">{user.student_id}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className={clsx(CARD_STYLE, "profile-card opacity-0 scale-95 w-full h-16 py-0 flex items-center justify-center gap-3 text-lg font-medium text-zinc-400 hover:text-red-400 transition-colors")}>
                                    { buttonLoad ?
                                        <LoaderCircle size={22} className="animate-spin" /> :
                                        <LogOut size={22} />
                                    }
                                Log out
 
                            </button>
                        </>
                    ) : (
                        <div className={clsx(CARD_STYLE, "flex items-center justify-center text-zinc-500 text-lg py-10")}>
                            Not signed in
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}