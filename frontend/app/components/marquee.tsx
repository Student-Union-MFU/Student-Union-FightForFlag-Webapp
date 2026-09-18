"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const cards = [
  {
    number: "01",
    title: "Fight For Flag",
    text: "Stand together. Make your choice.",
  },
  {
    number: "02",
    title: "Vote 2026",
    text: "Your voice shapes the future.",
  },
  {
    number: "03",
    title: "Student Union",
    text: "Represent your community.",
  },
  {
    number: "04",
    title: "Make A Choice",
    text: "Every vote matters.",
  },
];

function Card({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        mb-3
        flex
        h-[190px]
        w-[108px]
        shrink-0
        flex-col
        justify-between
        overflow-hidden
        rounded-[20px]
        border
        border-black/20
        bg-white/50
        p-3
        backdrop-blur-[3px]

        sm:mb-4
        sm:h-[380px]
        sm:w-[150px]
        sm:rounded-[24px]
        sm:p-4

        md:h-[460px]
        md:w-[170px]

        lg:mb-5
        lg:h-[560px]
        lg:w-[200px]
        lg:rounded-[28px]
        lg:p-5

        xl:h-[600px]
        xl:w-[220px]
      "
    >
      {/* Top */}
      <span className="text-[8px] font-semibold opacity-70 sm:text-[10px]">
        {number}
      </span>

      {/* Center */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <span className="text-[7px] font-bold tracking-[0.14em] opacity-60 sm:text-[9px]">
          FIGHT FOR FLAG26
        </span>

        <h2
          className="
            text-[20px]
            font-medium
            leading-[0.95]
            tracking-[-0.06em]

            sm:text-[28px]

            md:text-[32px]

            lg:text-[38px]

            xl:text-[42px]
          "
        >
          {title}
        </h2>

        <p
          className="
            max-w-[100px]
            text-[8px]
            leading-[1.4]
            opacity-60

            sm:max-w-[140px]
            sm:text-[10px]

            lg:max-w-[180px]
            lg:text-[11px]
          "
        >
          {text}
        </p>
      </div>

      {/* Bottom */}
      <div
        className="
          flex
          justify-between
          text-[7px]
          font-semibold
          opacity-50

          sm:text-[9px]
        "
      >
        <span>2026</span>
        <span>MFU</span>
      </div>
    </div>
  );
}

const columnSettings = [
  {
    duration: 19,
    direction: "up",
    margin: "",
  },
  {
    duration: 27,
    direction: "down",
    margin: "mt-[-60px]",
  },
  {
    duration: 34,
    direction: "up",
    margin: "mt-[-30px]",
  },
  {
    duration: 23,
    direction: "down",
    margin: "mt-[-100px]",
  },
  {
    duration: 31,
    direction: "up",
    margin: "mt-[-50px]",
  },
  {
    duration: 26,
    direction: "down",
    margin: "mt-[-120px]",
  },
];

export default function VerticalCardMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      const columns =
        container.querySelectorAll<HTMLElement>(".marquee-column");

      columns.forEach((column, index) => {
        const track =
          column.querySelector<HTMLElement>(".marquee-track");

        if (!track) return;

        /*
         * Because the cards are rendered twice,
         * half of the track represents one complete set.
         */
        const distance = track.scrollHeight / 2;

        const settings =
          columnSettings[index % columnSettings.length];

        if (settings.direction === "up") {
          gsap.fromTo(
            track,
            {
              y: 0,
            },
            {
              y: -distance,
              duration: settings.duration,
              ease: "none",
              repeat: -1,
              force3D: true,
            }
          );
        } else {
          gsap.fromTo(
            track,
            {
              y: -distance,
            },
            {
              y: 0,
              duration: settings.duration,
              ease: "none",
              repeat: -1,
              force3D: true,
            }
          );
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        flex
        justify-center
        gap-2
        overflow-hidden
        opacity-[0.20]

        sm:gap-3

        md:gap-4

        lg:gap-5

        xl:gap-6
      "
    >
      {/* TOP FADE */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-20
          h-[24%]
          bg-gradient-to-b
          from-white
          via-white/80
          to-transparent
        "
      />

      {/* BOTTOM FADE */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-20
          h-[24%]
          bg-gradient-to-t
          from-white
          via-white/80
          to-transparent
        "
      />

      {/* MOBILE: 3 COLUMNS */}
      {columnSettings.slice(0, 3).map((settings, index) => (
        <div
          key={index}
          className={`
            marquee-column
            shrink-0
            w-[108px]
            ${settings.margin}

            sm:w-[150px]

            md:hidden
          `}
        >
          <div className="marquee-track flex flex-col will-change-transform">
            {[...cards, ...cards].map((card, cardIndex) => (
              <Card
                key={`mobile-${index}-${cardIndex}`}
                {...card}
              />
            ))}
          </div>
        </div>
      ))}

      {/* TABLET: 4 COLUMNS */}
      {columnSettings.slice(0, 4).map((settings, index) => (
        <div
          key={index}
          className={`
            marquee-column
            hidden
            shrink-0
            w-[170px]
            ${settings.margin}

            md:block

            lg:hidden
          `}
        >
          <div className="marquee-track flex flex-col will-change-transform">
            {[...cards, ...cards].map((card, cardIndex) => (
              <Card
                key={`tablet-${index}-${cardIndex}`}
                {...card}
              />
            ))}
          </div>
        </div>
      ))}

      {/* DESKTOP: 5 COLUMNS */}
      {columnSettings.slice(0, 5).map((settings, index) => (
        <div
          key={index}
          className={`
            marquee-column
            hidden
            shrink-0
            w-[200px]
            ${settings.margin}

            lg:block

            xl:hidden
          `}
        >
          <div className="marquee-track flex flex-col will-change-transform">
            {[...cards, ...cards].map((card, cardIndex) => (
              <Card
                key={`desktop-${index}-${cardIndex}`}
                {...card}
              />
            ))}
          </div>
        </div>
      ))}

      {/* LARGE DESKTOP: 6 COLUMNS */}
      {columnSettings.slice(0, 6).map((settings, index) => (
        <div
          key={index}
          className={`
            marquee-column
            hidden
            shrink-0
            w-[220px]
            ${settings.margin}

            xl:block
          `}
        >
          <div className="marquee-track flex flex-col will-change-transform">
            {[...cards, ...cards].map((card, cardIndex) => (
              <Card
                key={`large-${index}-${cardIndex}`}
                {...card}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}