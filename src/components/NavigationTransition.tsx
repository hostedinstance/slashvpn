'use client';

/**
 * NavigationTransition — шим обратной совместимости
 * ─────────────────────────────────────────────────────────────────────────────
 * Все компоненты используют:
 *   import { useNavigate } from '@/components/NavigationTransition'
 *
 * Проксирует в usePageTransition() из TransitionProvider.
 * navigate()      — клиентская навигация с blur-эффектом
 * isTransitioning — true пока идёт blur-переход (= isNavigating)
 */

import { type ReactNode } from 'react';
import { usePageTransition } from '@/providers/TransitionProvider';

export function useNavigate() {
  const { navigate, isNavigating } = usePageTransition();
  return {
    navigate,
    isTransitioning: isNavigating,
  };
}

// Пустая обёртка — TransitionProvider уже выше в дереве через LayoutWrapper
export function NavigationTransitionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// No-op — оставлен для совместимости
export function triggerPageReveal(_ms?: number) {}
