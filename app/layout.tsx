import type { Metadata, Viewport } from "next";
import { Manrope, Roboto_Mono } from "next/font/google";
import { PwaRegister } from "@/components/pwa/pwa-register";
import { AppProviders } from "@/components/ui/app-providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Photo Calculator",
  description: "Photo studio service calculator",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Photo Calculator",
  },
};

export const viewport: Viewport = {
  themeColor: "#28635c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${robotoMono.variable} antialiased`}>
        <AppProviders>
          <PwaRegister />
          <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
