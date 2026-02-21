'use client';

/**
 * AuthLayout — layout для группы (auth): login / register / verify-email
 *
 * NeuralBackground живёт здесь (вне PageTransition) — не перерисовывается
 * при переходах между auth-страницами, даёт единый фон для всего flow.
 *
 * PageTransition регистрирует framer-motion variants для enter/exit.
 * AnimatePresence в LayoutWrapper оркеструет переходы между auth-страницами.
 */

import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { NeuralBackground } from '@/components/NeuralBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Persistent full-page background — outside transitions so it
          doesn't flicker when navigating between auth pages */}
      <div
        aria-hidden
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '100vw',
          height:        '100vh',
          zIndex:        0,
          pointerEvents: 'none',
        }}
      >
        <NeuralBackground />

        {/* Blue centre glow */}
        <div
          aria-hidden
          style={{
            position:      'absolute',
            inset:         0,
            pointerEvents: 'none',
            background:    'radial-gradient(ellipse 60% 50% at 50% 38%, rgba(0,80,200,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Edge vignette */}
        <div
          aria-hidden
          style={{
            position:      'absolute',
            inset:         0,
            pointerEvents: 'none',
            background:    'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,9,43,0.72) 100%)',
          }}
        />
      </div>

      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}
