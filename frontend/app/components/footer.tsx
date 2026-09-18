import Link from "next/link";
import Container from "./container";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/vote", label: "Vote" },
  { href: "/results", label: "Results" },
];

const ORGANIZERS = [
  { name: "Student Union", href: "https://mfu.ac.th" },
  { name: "SHS", href: "#" },
];

export function Footer() {
  return (
    <footer className="
        flex justify-between
        w-full h-auto py-2 px-4
    ">
        <div className="hidden lg:flex lg:flex-col h-full w-auto text-2xl">

            <h1 className="flex items-end gap-2 ">
                <span className="text-lg">made by</span>
                Student Union Developer Team
            </h1>
            <p className="text-base">
                &copy; {new Date().getFullYear()} Fight for Flag 26, All rights reserved.
            </p>
        </div>
        <div className="flex flex-col items-center lg:hidden w-full h-auto">
          <h2 className="text-xl">
            Fight For Flag
          </h2>
          <p className="text-sm mt-1">
              &copy; {new Date().getFullYear()} Fight for Flag 26, All rights reserved.
          </p>
          <p className="text-sm">website by Student Union Dev Team</p>
        </div>
    </footer>
  );
}