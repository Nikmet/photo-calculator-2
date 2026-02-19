"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SizePanel } from "@/components/calculator/size-panel";
import { PwaInstallButton } from "@/components/pwa/pwa-install-button";

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
    <header className="border-b border-[var(--accent)]/20 bg-[linear-gradient(135deg,#f7fcfb_0%,#ecf6f2_55%,#e7f1ff_100%)] shadow-[0_10px_30px_rgba(25,60,55,0.12)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
              Photo Studio
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
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
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-out",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_6px_18px_rgba(45,127,113,0.35)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--accent)]/60 hover:bg-white",
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
