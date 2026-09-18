import clsx from "clsx";
import React from "react";

export default function Container({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("box-border", className)}>
      {children}
    </section>
  );
}