"use client";
import { useRef, Children, isValidElement } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import clsx from "clsx";

interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
}

const COLUMN_COUNT = 5; // matches lg:grid-cols-7 — keep in sync if you change breakpoints
const ZIGZAG_OFFSET = 40; // px, applied to odd columns

export function MasonryGrid({ children, className }: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(".masonry-item", containerRef.current);

      cards.forEach((card, i) => {
        const col = i % COLUMN_COUNT;
        const finalY = col % 2 === 0 ? 0 : ZIGZAG_OFFSET;

        gsap.fromTo(
          card,
          { opacity: 0, y: finalY + 24, scale: 0.96 },
          {
            opacity: 1,
            y: finalY,
            scale: 1,
            duration: 0.5,
            delay: i * 0.08,
            ease: "power2.out",
          }
        );
      });
    },
    { scope: containerRef, dependencies: [items.length] }
  );

  return (
    <div
      ref={containerRef}
      className={clsx(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        "gap-x-10 gap-y-10",
        className
      )}
    >
      {items.map((child, i) => (
        <div
          key={isValidElement(child) ? child.key ?? i : i}
          className="masonry-item h-full w-full"
        >
          {child}
        </div>
      ))}
    </div>
  );
}