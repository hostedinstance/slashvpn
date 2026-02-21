'use client';

/**
 * TransitionProvider
 * ─────────────────────────────────────────────────────────────────────────────
 * Единственный источник правды для навигационных переходов.
 *
 * Поведение:
 *   navigate(href)     — клиентская навигация с blur-эффектом на контенте.
 *                        НЕ показывает overlay-лоадер. Blur применяется через
 *                        BlurWrapper в LayoutWrapper.
 *   withTransition(fn) — async-операция (логин, запросы). Показывает isLoading
 *                        для компонентов, которые хотят это использовать.
 *   isNavigating       — true пока идёт переход между страницами (для blur)
 *   isLoading          — true пока выполняется withTransition()
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TransitionContextType {
  /** true пока идёт переход между роутами (для blur-эффекта) */
  isNavigating: boolean;
  /** true пока выполняется withTransition() */
  isLoading: boolean;
  startLoading: () => void;
  stopLoading:  () => void;
  /** Обёртка для async-операций */
  withTransition: <T>(fn: () => Promise<T>) => Promise<T>;
  /** Навигация с blur-эффектом на контенте */
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);

  const pathname = usePathname();
  const router   = useRouter();
  const busyRef  = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Сбрасываем blur как только pathname реально изменился
  useEffect(() => {
    setIsNavigating(false);
    busyRef.current = false;
  }, [pathname]);

  // Cleanup
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const startLoading = useCallback(() => setIsLoading(true),  []);
  const stopLoading  = useCallback(() => setIsLoading(false), []);

  const withTransition = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      return await fn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const navigate = useCallback((href: string) => {
    if (busyRef.current) return;

    const normalizedHref    = href.split('?')[0];
    const normalizedCurrent = pathname.split('?')[0];
    if (normalizedHref === normalizedCurrent) return;

    busyRef.current = true;
    setIsNavigating(true); // → blur включается мгновенно

    // Минимальная задержка: даём blur проиграть, затем пушим роут
    timerRef.current = setTimeout(() => {
      router.push(href);
      // isNavigating сбросится через useEffect[pathname]
    }, 160);
  }, [pathname, router]);

  return (
    <TransitionContext.Provider value={{
      isNavigating,
      isLoading,
      startLoading,
      stopLoading,
      withTransition,
      navigate,
    }}>
      {children}
    </TransitionContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePageTransition(): TransitionContextType {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('usePageTransition must be used within a TransitionProvider');
  return ctx;
}
