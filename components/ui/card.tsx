import clsx from "clsx";
import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={clsx(
        "animate-fade-in-up rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)] transition-all duration-400 ease-out",
        className,
      )}
    >
      {children}
    </section>
  );
}
