"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SizePanel } from "@/components/calculator/size-panel";
import { PwaInstallButton } from "@/components/pwa/pwa-install-button";
import { APP_VERSION } from "@/lib/constants";

const links = [
  { href: "/", label: "Главная" },
  { href: "/banner", label: "Баннер" },
  { href: "/tape", label: "Пленка ПВХ" },
  { href: "/cut", label: "Лазерная резка" },
  { href: "/termo", label: "Термотрансфер" },
  { href: "/admin/prices", label: "Админка" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Photo Studio · v{APP_VERSION}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Photo Calculator
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            <PwaInstallButton />
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-lg border px-3.5 py-2 text-sm font-medium transition-[border-color,background-color,color,box-shadow] duration-150",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--card)] shadow-[var(--shadow-soft)]"
                      : "border-[var(--border)] bg-[var(--control)] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <SizePanel />
      </div>
    </header>
  );
}
