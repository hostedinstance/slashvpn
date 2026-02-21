'use client';

/**
 * AuthPageLayout
 * ─────────────────────────────────────────────────────────────────────────────
 * Общий layout для всех auth-страниц (/login, /register, /verify-email).
 *
 * Структура:
 *   - NeuralBackground: position:fixed, 100vw×100vh — заполняет весь экран
 *   - AuthNav: sticky navbar с логотипом + «На главную»
 *   - Контент: центрированная glass-карточка
 */

import React from 'react';
import Image from 'next/image';
import logotext from '@/assets/logotext.png';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@/components/NavigationTransition';
import { authStyles } from '@/config/theme.config';

// ─── Types ────────────────────────────────────────────────────────────────────

/** @deprecated Оставлен для обратной совместимости с page.tsx. Не используется. */
export interface AuroraConfig {
  colorStops: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
  flipVertical?: boolean;
}

export interface AuthPageLayoutProps {
  /** Мелкая подпись под glass-карточкой */
  footerNote?: string;
  /** CSS padding для glass-карточки */
  cardPadding?: string;
  /** @deprecated Не используется — оставлен для обратной совместимости */
  aurora?: AuroraConfig;
  /** @deprecated Не используется */
  backLabel?: string;
  /** @deprecated Не используется */
  backHref?: string;
  /** @deprecated Не используется */
  cardClassName?: string;
  children: React.ReactNode;
}

// ─── AuthNav ──────────────────────────────────────────────────────────────────

function AuthNav() {
  const { navigate } = useNavigate();

  return (
    <div className="relative z-30 flex justify-center py-6">
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 48,
          padding: '0 6px 0 16px',
          borderRadius: 24,
          background: authStyles.navBg,
          backdropFilter: authStyles.navBackdrop,
          WebkitBackdropFilter: authStyles.navBackdrop,
          boxShadow: authStyles.navShadow,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', height: 19, marginRight: 14 }}
          className="opacity-85 hover:opacity-100 transition-opacity duration-200 shrink-0"
        >
          <Image src={logotext} alt="SlashVPN" className="h-full w-auto object-contain" priority />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: authStyles.navDivider, marginRight: 2 }} />

        {/* Back to main */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 rounded-2xl shrink-0 transition-all duration-150"
          style={{ padding: '7px 14px', fontFamily: 'var(--font-inter-tight)', fontSize: 12, fontWeight: 600, color: authStyles.backBtnColor }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = authStyles.backBtnHoverBg;
            el.style.color = authStyles.backBtnHoverColor;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '';
            el.style.color = authStyles.backBtnColor;
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          На главную
        </button>
      </nav>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export function AuthPageLayout({ footerNote, cardPadding = authStyles.cardPadding, children }: AuthPageLayoutProps) {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
        isolation: 'auto',
      }}
    >
      {/* Navbar */}
      <AuthNav />

      {/* Центрированный контент */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 1rem 5rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: authStyles.cardMaxWidth }}>
          {/* Glass card */}
          <div
            style={{
              borderRadius: authStyles.cardRadius,
              border: `1px solid ${authStyles.cardBorder}`,
              background: authStyles.cardBg,
              backdropFilter: authStyles.cardBackdrop,
              WebkitBackdropFilter: authStyles.cardBackdrop,
              boxShadow: authStyles.cardShadow,
              padding: cardPadding,
            }}
          >
            {children}
          </div>

          {footerNote && (
            <p
              style={{
                marginTop: '1.25rem',
                textAlign: 'center',
                fontFamily: 'var(--font-inter-tight)',
                fontSize: 12,
                color: authStyles.footerNoteColor,
              }}
            >
              {footerNote}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
