import { formatRub } from "@/lib/format";

type ResultItemProps = {
  label: string;
  value: number;
};

export function ResultItem({ label, value }: ResultItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--accent)]/35 bg-[image:var(--result-bg)] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <span className="text-sm font-medium text-[var(--accent-strong)]">{label}</span>
      <strong className="font-mono text-xl font-semibold tracking-tight text-[var(--accent-strong)]">
        {formatRub(value)}
      </strong>
    </div>
  );
}
