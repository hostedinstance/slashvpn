'use client';

/**
 * LayoutWrapper
 * ─────────────────────────────────────────────────────────────────────────────
 * BlurWrapper слушает isNavigating из TransitionProvider и применяет
 * плавный blur + затемнение при клиентских переходах между страницами.
 *
 * willChange проставляется ТОЛЬКО в момент навигации — не постоянно.
 * Постоянный willChange:filter держит всю страницу в отдельном GPU-слое
 * и убивает производительность на мобильных устройствах.
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
        filter:        isNavigating ? 'blur(8px) brightness(0.6)' : 'none',
        opacity:       isNavigating ? 0.55 : 1,
        transition:    isNavigating
          ? 'filter 0.22s ease, opacity 0.22s ease'
          : 'filter 0.40s ease, opacity 0.40s ease',
        willChange:    isNavigating ? 'filter, opacity' : 'auto',
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
