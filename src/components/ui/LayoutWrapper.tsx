'use client';

/**
 * LayoutWrapper
 * ─────────────────────────────────────────────────────────────────────────────
 * BlurWrapper слушает isNavigating из TransitionProvider и применяет
 * плавный blur + затемнение при клиентских переходах между страницами.
 *
 * Параметры blur намеренно мягкие — эффект заметный, но не агрессивный:
 *   appear : 0.22s (быстро — пользователь уже нажал)
 *   disappear: 0.40s (чуть медленнее — новая страница появляется плавно)
 */

import { type ReactNode } from 'react';
import { TransitionProvider, usePageTransition } from '@/providers/TransitionProvider';

function BlurWrapper({ children }: { children: ReactNode }) {
  const { isNavigating } = usePageTransition();

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        flex:          1,
        minHeight:     '100dvh',
        width:         '100%',
        // Blur + небольшое затемнение при переходе
        filter:        isNavigating ? 'blur(8px) brightness(0.6)' : 'blur(0px) brightness(1)',
        opacity:       isNavigating ? 0.55 : 1,
        // appear быстрее, disappear медленнее для плавного входа
        transition:    isNavigating
          ? 'filter 0.22s ease, opacity 0.22s ease'
          : 'filter 0.40s ease, opacity 0.40s ease',
        willChange:    'filter, opacity',
      }}
    >
      {children}
    </div>
  );
}

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <TransitionProvider>
      <BlurWrapper>
        {children}
      </BlurWrapper>
    </TransitionProvider>
  );
}
