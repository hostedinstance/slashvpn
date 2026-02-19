'use client';

import React, { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';

/**
 * Компонент-перехватчик anchor-кликов.
 * Монтируется ВНУТРИ ReactLenis, поэтому useLenis() гарантированно возвращает инстанс.
 */
function AnchorHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href?.startsWith('#')) return;

      const section = document.querySelector(href);
      if (!section) return;

      e.preventDefault();
      lenis.scrollTo(section as HTMLElement, {
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        syncTouch: true,
      }}
    >
      <AnchorHandler />
      {children}
    </ReactLenis>
  );
}
