import clsx from "clsx";
import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={clsx(
        "animate-fade-in-up rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow,transform] duration-200 ease-out",
        className,
      )}
    >
      {children}
    </section>
  );
}
