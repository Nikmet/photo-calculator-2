"use client";

import { useState } from "react";
import { normalizeNumber } from "@/lib/math";

type NumberInputProps = {
  id: string;
  label: string;
  value: number;
  onChange?: (value: number) => void;
  unit?: string;
  hint?: string;
  step?: number;
  readOnly?: boolean;
};

export function NumberInput({
  id,
  label,
  value,
  onChange,
  unit,
  hint,
  step = 1,
  readOnly = false,
}: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const displayValue =
    Number.isFinite(value) && value === 0 && isFocused && !readOnly
      ? ""
      : Number.isFinite(value)
        ? String(value)
        : "";

  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[var(--text)]">
        {label}
        {unit ? <span className="ml-1 text-xs text-[var(--muted)]">({unit})</span> : null}
      </span>
      <input
        id={id}
        type="number"
        min={0}
        step={step}
        value={Number.isFinite(value) ? displayValue : ""}
        readOnly={readOnly}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onWheel={(event) => {
          event.preventDefault();
          event.currentTarget.blur();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
          }
        }}
        onChange={(event) => onChange?.(normalizeNumber(event.target.value))}
        className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 text-base outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] read-only:bg-slate-100/70"
      />
      {hint ? <span className="text-xs text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}
