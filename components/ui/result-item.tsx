import { formatRub } from "@/lib/format";

type ResultItemProps = {
  label: string;
  value: number;
};

export function ResultItem({ label, value }: ResultItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--result-bg)] px-4 py-3">
      <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      <strong className="shrink-0 font-mono text-lg font-semibold tracking-tight text-[var(--accent-strong)]">
        {formatRub(value)}
      </strong>
    </div>
  );
}
