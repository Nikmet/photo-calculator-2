import type { PropsWithChildren } from "react";
import { CalculatorProvider } from "@/components/calculator/calculator-context";
import { SiteHeader } from "@/components/layout/site-header";

export default function CalculatorLayout({ children }: PropsWithChildren) {
  return (
    <CalculatorProvider>
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
      </div>
    </CalculatorProvider>
  );
}
