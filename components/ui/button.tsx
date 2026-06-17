import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "h-10 rounded-lg px-4 text-sm font-medium transition-[border-color,background-color,color,opacity,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" &&
          "border border-[var(--accent)] bg-[var(--accent)] text-[var(--card)] hover:bg-[var(--accent-strong)]",
        variant === "secondary" &&
          "border border-[var(--border)] bg-[var(--control)] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]",
        variant === "danger" &&
          "border border-[var(--danger)] bg-[var(--card)] text-[var(--danger)] hover:bg-[var(--danger-soft)]",
        className,
      )}
    />
  );
}
