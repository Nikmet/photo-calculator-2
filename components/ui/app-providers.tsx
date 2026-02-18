"use client";

import type { PropsWithChildren } from "react";
import { ToastProvider } from "@/components/ui/toast-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return <ToastProvider>{children}</ToastProvider>;
}
