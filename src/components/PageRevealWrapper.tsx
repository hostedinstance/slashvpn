'use client';

/**
 * PageRevealWrapper — plain wrapper, no reveal animation on page load/refresh.
 */

import { type ReactNode } from 'react';

interface PageRevealWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageRevealWrapper({ children, className }: PageRevealWrapperProps) {
  return (
    <div className={className} style={{ minHeight: '100dvh' }}>
      {children}
    </div>
  );
}
