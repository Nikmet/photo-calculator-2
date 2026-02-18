"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type PropsWithChildren } from "react";
import { AdminTokenProvider, useAdminToken } from "@/components/admin/admin-token-context";

const links = [
  { href: "/admin/prices", label: "Цены" },
  { href: "/admin/min-price", label: "Базовые настройки" },
];

function AdminLayoutBody({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { token, setToken } = useAdminToken();
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
              ← На главную
            </Link>
            <h1 className="mt-2 text-2xl font-semibold">Панель администратора</h1>
          </div>

          <label className="flex min-w-72 flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Admin token
            </span>
            <div className="flex gap-2">
              <input
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                placeholder="Введите ADMIN_TOKEN"
              />
              <button
                type="button"
                onClick={() => setShowToken((prev) => !prev)}
                className="h-10 rounded-xl border border-[var(--border)] px-3 text-xs font-medium text-[var(--muted)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {showToken ? "Скрыть" : "Показать"}
              </button>
            </div>
          </label>
        </div>

        <nav className="mt-4 flex flex-wrap gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                  active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_6px_18px_rgba(45,127,113,0.35)]"
                    : "border-[var(--border)] hover:border-[var(--accent)]/70",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="pb-6">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <AdminTokenProvider>
      <AdminLayoutBody>{children}</AdminLayoutBody>
    </AdminTokenProvider>
  );
}
