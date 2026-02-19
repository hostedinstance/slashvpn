'use client';

import React from 'react';
import AuroraShader from '@/components/Aurora';
import { FloatingHeader } from '@/components/FloatingHeader';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { authCard } from '@/config/site.config';
import { useNavigate } from '@/components/NavigationTransition';
import { fonts } from '@/config/theme.config';

export interface AuroraConfig {
  colorStops: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
  flipVertical?: boolean;
}

export interface AuthPageLayoutProps {
  aurora: AuroraConfig;
  /** Текст кнопки «назад» */
  backLabel: string;
  backHref: string;
  /** Подпись под карточкой */
  footerNote?: string;
  /** Дополнительные классы карточки */
  cardClassName?: string;
  children: React.ReactNode;
}

export function AuthPageLayout({
  aurora,
  backLabel,
  backHref,
  footerNote,
  cardClassName,
  children,
}: AuthPageLayoutProps) {
  const { navigate } = useNavigate();

  return (
    <main className="relative min-h-screen bg-[#07070f] flex flex-col">

      {/* Aurora fullscreen */}
      <div className="fixed inset-0 z-0">
        <AuroraShader
          colorStops={aurora.colorStops}
          amplitude={aurora.amplitude}
          blend={aurora.blend}
          speed={aurora.speed}
          flipVertical={aurora.flipVertical}
        />
      </div>

      {/* Header */}
      <div className="relative z-20">
        <FloatingHeader logo={logo} authMode />
      </div>

      {/* Контент */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">

          {/* Кнопка назад */}
          <button
            onClick={() => navigate(backHref)}
            className={`inline-flex items-center gap-2 mb-5 text-white/40 hover:text-white/80 transition-colors group ${fonts.body} text-sm`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            {backLabel}
          </button>

          {/* Карточка */}
          <div className={cn(authCard.className, cardClassName)}>
            {children}
          </div>

          {/* Подпись */}
          {footerNote && (
            <p className={`mt-4 text-center text-xs text-white/30 ${fonts.body}`}>
              {footerNote}
            </p>
          )}

        </div>
      </div>
    </main>
  );
}
