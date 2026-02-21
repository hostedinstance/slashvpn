'use client';

/**
 * AuthPageLayout
 * ─────────────────────────────────────────────────────────────────────────────
 * Общий layout для всех auth-страниц (/login, /register, /verify-email).
 *
 * Структура:
 *   - NeuralBackground: position:fixed, 100vw×100vh — заполняет весь экран
 *   - AuthNav: sticky navbar с логотипом + "На главную"
 *   - Контент: центрированная glass-карточка
 *
 * Props:
 *   footerNote   — мелкая подпись под карточкой (опционально)
 *   cardPadding  — padding карточки (дефолт: '2.25rem 2rem')
 *   children     — форма
 */

import React from 'react';
import Image from 'next/image';
import logotext from '@/assets/logotext.png';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@/components/NavigationTransition';

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
    <div className="relative z-30 flex justify-center py-3">
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 48,
          padding: '0 6px 0 16px',
          borderRadius: 24,
          background: 'rgba(0,9,43,0.78)',
          backdropFilter: 'blur(32px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
          boxShadow: '0 0 0 1px rgba(100,140,255,0.13), 0 8px 32px -8px rgba(0,0,0,0.50)',
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
        <div style={{ width: 1, height: 16, background: 'rgba(100,140,255,0.15)', marginRight: 2 }} />

        {/* Back to main */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 rounded-2xl shrink-0 transition-all duration-150"
          style={{ padding: '7px 14px', fontFamily: 'var(--font-inter-tight)', fontSize: 12, fontWeight: 600, color: 'rgba(180,205,255,0.55)' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(100,140,255,0.10)'; el.style.color = 'rgba(210,228,255,0.90)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = ''; el.style.color = 'rgba(180,205,255,0.55)'; }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          На главную
        </button>
      </nav>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export function AuthPageLayout({ footerNote, cardPadding = '2.25rem 2rem', children }: AuthPageLayoutProps) {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent', // NeuralBackground is in auth/layout.tsx
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
        <div style={{ width: '100%', maxWidth: 448 }}>
          {/* Glass card */}
          <div
            style={{
              borderRadius: 22,
              border: '1px solid rgba(100,140,255,0.13)',
              background: 'rgba(0,9,43,0.52)',
              backdropFilter: 'blur(44px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(44px) saturate(1.6)',
              boxShadow:
                '0 24px 64px -12px rgba(0,0,0,0.65),' +
                ' inset 0 1px 0 rgba(100,140,255,0.10)',
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
                color: 'rgba(140,175,255,0.28)',
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
