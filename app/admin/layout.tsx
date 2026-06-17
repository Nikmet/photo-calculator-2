"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type PropsWithChildren } from "react";
import { AdminTokenProvider, useAdminToken } from "@/components/admin/admin-token-context";
import { Button } from "@/components/ui/button";
import { APP_VERSION } from "@/lib/constants";

const links = [
  { href: "/admin/prices", label: "Цены" },
  { href: "/admin/min-price", label: "Базовые настройки" },
];

function AdminLayoutBody({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { token, setToken } = useAdminToken();
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-5">
      <header className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
              ← На главную
            </Link>
            <h1 className="mt-2 text-2xl font-semibold">Панель администратора</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">Версия приложения: {APP_VERSION}</p>
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
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--control)] px-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                placeholder="Введите ADMIN_TOKEN"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowToken((prev) => !prev)}
                className="px-3 text-xs"
              >
                {showToken ? "Скрыть" : "Показать"}
              </Button>
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
                  "rounded-lg border px-3.5 py-2 text-sm font-medium transition-[border-color,background-color,color] duration-150",
                  active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--card)]"
                    : "border-[var(--border)] bg-[var(--control)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]",
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
