import type { Metadata } from "next";
import { Manrope, Roboto_Mono } from "next/font/google";
import { AppProviders } from "@/components/ui/app-providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photo Calculator",
  description: "Современный калькулятор услуг фотосалона",
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
          <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
