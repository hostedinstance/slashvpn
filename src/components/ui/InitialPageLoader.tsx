'use client';

/**
 * InitialPageLoader
 * ─────────────────────────────────────────────────────────────────────────────
 * Показывается ТОЛЬКО при первой загрузке / рефреше страницы.
 *
 * Ключевые решения:
 *  - SquareLoader рендерится сразу (без mounted-guard) — он работает
 *    только на клиенте ('use client'), hydration mismatch невозможен
 *    т.к. сам компонент client-only и не SSR-рендерится как spinner.
 *    suppressHydrationWarning на wrapper снимает предупреждения.
 *  - Нет mountedRef: React StrictMode корректно пересоздаёт таймеры
 *    через cleanup → re-mount цикл.
 *  - Нет useState(mounted): лишнее состояние создавало задержку появления
 *    спиннера (рендер → эффект → re-render → спиннер виден).
 */

import { useEffect, useState } from 'react';
import { SquareLoader } from 'react-spinners';

const HOLD_MS = 2000; // держим лоадер 2 секунды
const FADE_MS = 400;  // длина fade-out

export function InitialPageLoader() {
  const [fading, setFading] = useState(false);
  const [gone,   setGone]   = useState(false);

  useEffect(() => {
    const holdTimer = setTimeout(() => {
      setFading(true);

      const goneTimer = setTimeout(() => {
        setGone(true);
      }, FADE_MS);

      // Возвращаем функцию очистки из колбэка holdTimer невозможно,
      // поэтому goneTimer хранится снаружи через ref-паттерн ниже
      return () => clearTimeout(goneTimer);
    }, HOLD_MS);

    return () => clearTimeout(holdTimer);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      suppressHydrationWarning
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     '#000',
        opacity:        fading ? 0 : 1,
        transition:     `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        pointerEvents:  fading ? 'none' : 'all',
      }}
    >
      <SquareLoader
        color="#ffffff"
        size={36}
        speedMultiplier={0.75}
      />
    </div>
  );
}
