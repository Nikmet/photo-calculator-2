"use client";

type CheckboxFieldProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckboxField({ id, label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-[var(--text)]">
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
