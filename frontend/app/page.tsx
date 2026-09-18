import Image from "next/image";
import Container from "./components/container";
import Link from "next/link";
import VerticalCardMarquee from "./components/marquee";

export default function Home() {
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
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <VerticalCardMarquee />
        </div>

        {/* Foreground content */}
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
            <p
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
              <span className="text-base lg:text-xl">
                Voting Closed in
              </span>

              2:15:09
            </p>

            <p className="flex w-xs text-center text-base lg:w-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>

            <Link
              href="/voting"
              className="relative z-20"
            >
              <div
                className="
                  h-full
                  w-fit
                  rounded-full
                  border-4
                  border-transparent
                  bg-zinc-900
                  px-10
                  py-3
                  text-zinc-50
                  transition-all
                  cursor-pointer

                  hover:border-zinc-900
                  hover:bg-zinc-50
                  hover:text-zinc-900
                "
              >
                <p>Vote Now</p>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}