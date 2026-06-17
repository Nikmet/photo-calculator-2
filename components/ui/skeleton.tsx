import clsx from "clsx";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={clsx("animate-pulse rounded-lg bg-[var(--surface-muted)]", className)} />;
}
