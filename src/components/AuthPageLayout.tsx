'use client';

/**
 * AuthPageLayout
 * ─────────────────────────────────────────────────────────────────────────────
 * Переиспользуемая обёртка для auth-страниц (login, register, verify-email).
 *
 * Props (все опциональны если страница использует дефолты из site.config):
 *   aurora       — настройки Aurora-шейдера (из aurora.* в site.config)
 *   backLabel    — текст кнопки назад (из authLayout.* в site.config)
 *   backHref     — маршрут кнопки назад
 *   footerNote   — подпись под карточкой
 *   cardClassName — дополнительные классы для переопределения стиля карточки
 *   children     — форма внутри карточки
 */

import React from 'react';
import AuroraShader from '@/components/Aurora';
import { FloatingHeader } from '@/components/FloatingHeader';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { authCard } from '@/config/site.config';
import { useNavigate } from '@/components/NavigationTransition';

export interface AuroraConfig {
  colorStops: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
  flipVertical?: boolean;
}

export interface AuthPageLayoutProps {
  /** Настройки Aurora (из aurora.* в site.config) */
  aurora: AuroraConfig;
  /** Текст кнопки-стрелки: «На главную», «Изменить email» и т.д. */
  backLabel: string;
  /** Маршрут кнопки назад */
  backHref: string;
  /** Мелкий текст под карточкой */
  footerNote?: string;
  /**
   * Дополнительные Tailwind-классы для карточки.
   * Позволяет переопределить или дополнить authCard.className из site.config.
   * Пример: cardClassName="p-6" (заменит padding карточки только на этой странице)
   */
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
    <main className="relative min-h-screen bg-black flex flex-col">

      {/* Aurora — fullscreen фон */}
      <div className="fixed inset-0 z-0">
        <AuroraShader
          colorStops={aurora.colorStops}
          amplitude={aurora.amplitude}
          blend={aurora.blend}
          speed={aurora.speed}
          flipVertical={aurora.flipVertical}
        />
      </div>

      {/* FloatingHeader — стиль из header в site.config */}
      <div className="relative z-20">
        <FloatingHeader logo={logo} authMode />
      </div>

      {/* Контент */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">

          {/* Кнопка назад */}
          <button
            onClick={() => navigate(backHref)}
            className="inline-flex items-center gap-2 mb-4 text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm">{backLabel}</span>
          </button>

          {/* Карточка формы */}
          {/* Базовый стиль — из authCard.className в site.config */}
          {/* cardClassName переопределяет/дополняет только на конкретной странице */}
          <div className={cn(authCard.className, cardClassName)}>
            {children}
          </div>

          {/* Подпись под карточкой */}
          {footerNote && (
            <p className="mt-4 text-center text-xs text-white/40">
              {footerNote}
            </p>
          )}

        </div>
      </div>
    </main>
  );
}
