"use client";

type CheckboxFieldProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckboxField({ id, label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--control)] px-3 text-sm text-[var(--text)] transition-[border-color,background-color] duration-150 hover:border-[var(--border-strong)]"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
      />
      {label}
    </label>
  );
}
