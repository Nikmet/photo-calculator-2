"use client";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  hint?: string;
};

export function SelectField({ id, label, value, options, onChange, hint }: SelectFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-[var(--border)] bg-[var(--control)] px-3 text-sm outline-none transition-[border-color,box-shadow,background-color] duration-150 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="text-xs text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}
