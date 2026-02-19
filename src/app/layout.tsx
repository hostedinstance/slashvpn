import React from "react";
import type { Metadata } from "next";
import { Inter_Tight, Wix_Madefor_Display } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "@/styles/globals.css";
import PageLoader from "@/components/PageLoader";
import SmoothScroll from "@/components/SmoothScroll";
import { NavigationTransitionProvider } from "@/components/NavigationTransition";
import { AuthProvider } from "@/components/AuthProvider";

// ── Шрифты ───────────────────────────────────────────────────────────────────

const interTight = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const wixMadefor = Wix_Madefor_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-wix-madefor",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SlashVPN",
  description: "Быстрый, простой и надёжный VPN-сервис.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.scrollTo(0, 0);
            `,
          }}
        />
      </head>
      <body
        className={twMerge(
          interTight.variable,
          wixMadefor.variable,
          "text-white antialiased"
        )}
        style={{ backgroundColor: "#000" }}
        suppressHydrationWarning
      >
        <AuthProvider>
          <NavigationTransitionProvider>
            <SmoothScroll>
              <PageLoader />
              {children}
            </SmoothScroll>
          </NavigationTransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
