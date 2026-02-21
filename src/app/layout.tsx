import React from 'react';
import type { Metadata } from 'next';
import { Inter_Tight, Wix_Madefor_Display } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import '@/styles/globals.css';
import { LayoutWrapper } from '@/components/ui/LayoutWrapper';
import { InitialPageLoader } from '@/components/ui/InitialPageLoader';
import SmoothScroll from '@/components/SmoothScroll';
import { NavigationTransitionProvider } from '@/components/NavigationTransition';
import { AuthProvider } from '@/components/AuthProvider';

const interTight = Inter_Tight({
  subsets:  ['latin', 'cyrillic'],
  weight:   ['300', '400', '500', '600', '700'],
  variable: '--font-inter-tight',
  display:  'swap',
});

const wixMadefor = Wix_Madefor_Display({
  subsets:  ['latin', 'cyrillic'],
  weight:   ['400', '500', '600', '700', '800'],
  variable: '--font-wix-madefor',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       'SlashVPN',
  description: 'Быстрый, простой и надёжный VPN-сервис.',
  icons:       { icon: '/favicon.ico' },
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
        {/*
         * scrollRestoration=manual + scrollTo(0,0) при рефреше:
         * Предотвращает прыжок контента из-за восстановления позиции скролла
         * браузером ДО того как лоадер закрывается.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if('scrollRestoration'in history){history.scrollRestoration='manual';}window.scrollTo(0,0);})();`,
          }}
        />
      </head>
      <body
        className={twMerge(
          interTight.variable,
          wixMadefor.variable,
          'text-white antialiased',
        )}
        style={{ backgroundColor: '#000' }}
        suppressHydrationWarning
      >
        {/*
         * InitialPageLoader рендерится первым — браузер рисует чёрный экран
         * немедленно, до того как React гидратирует остальное дерево.
         * Это скрывает:
         *   - прыжок Hero при восстановлении скролла
         *   - мигание Prism (WebGL) пока не инициализировался
         *   - резкий старт TextType с пустой строки
         * Держится ровно 2 секунды, затем плавный fade-out за 350ms.
         */}
        <InitialPageLoader />

        <LayoutWrapper>
          <AuthProvider>
            <NavigationTransitionProvider>
              <SmoothScroll>
                {children}
              </SmoothScroll>
            </NavigationTransitionProvider>
          </AuthProvider>
        </LayoutWrapper>
      </body>
    </html>
  );
}
