import React from "react";
import type { Metadata } from "next";
import { Inter_Tight, Wix_Madefor_Display } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "@/styles/globals.css";
import PageLoader from "@/components/PageLoader";
import SmoothScroll from "@/components/SmoothScroll";
import { NavigationTransitionProvider } from "@/components/NavigationTransition";
import { AuthProvider } from "@/components/AuthProvider";

const interTight = Inter_Tight({
  subsets: ["cyrillic"],
  variable: "--font-inter-tight",
});

const wixMadefor = Wix_Madefor_Display({
  subsets: ["latin"],
  variable: "--font-wix-madefor",
});

export const metadata: Metadata = {
  title: "SlashVPN",
  description: "A landing page for an AI startup",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          "bg-black text-white antialiased font-wix-madefor"
        )}
        suppressHydrationWarning
      >
        {/*
          AuthProvider — самый внешний слой:
          инициализирует сессию и делает silent refresh токена.
          
          NavigationTransitionProvider — анимации переходов.
          
          SmoothScroll — Lenis для всех страниц.
        */}
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
