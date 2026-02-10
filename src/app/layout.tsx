import React from "react";
import type { Metadata } from "next";
import { Inter_Tight, Wix_Madefor_Display } from "next/font/google";
import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";
import "@/styles/globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { SquareLoader } from "react-spinners";

const interTight = Inter_Tight({
  subsets: ["cyrillic"],
  variable: "--font-inter-tight"
});

const grifterBold = localFont({
  src: '../../public/fonts/grifter-bold.woff2',
  variable: '--font-grifter-bold',
  weight: '700',
  display: 'swap',
});

const wixMadefor = Wix_Madefor_Display({
  subsets: ["latin"],
  variable: "--font-wix-madefor"
});

export const metadata: Metadata = {
  title: "SlashVPN",
  description: "A landing page for an AI startup",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
      />
      <style dangerouslySetInnerHTML={{
        __html: `
            body {
              opacity: 0;
              transition: opacity 0.5s ease-in;
            }
            body.loaded {
              opacity: 1;
            }
            #page-loader {
              position: fixed;
              inset: 0;
              background: black;
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: opacity 0.6s ease-out;
            }
            #page-loader.hide {
              opacity: 0;
              pointer-events: none;
            }
          `
      }} />
      <script dangerouslySetInnerHTML={{
        __html: `
            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);
          `
      }} />
    </head>
    <body
      className={twMerge(
        interTight.variable,
        wixMadefor.variable,
        grifterBold.variable,
        "bg-black text-white antialiased font-wix-madefor"
      )}
      suppressHydrationWarning
    >
    <div id="page-loader">
      <SquareLoader color="#fff" />
    </div>
    <SmoothScroll>{children}</SmoothScroll>
    <script dangerouslySetInnerHTML={{
      __html: `
            window.addEventListener('load', () => {
              document.body.classList.add('loaded');
              const loader = document.getElementById('page-loader');
              if (loader) {
                setTimeout(() => {
                  loader.classList.add('hide');
                  setTimeout(() => loader.remove(), 600);
                }, 2000);
              }
            });
          `
    }} />
    </body>
    </html>
  );
}