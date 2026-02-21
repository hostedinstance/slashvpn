import { useRef } from 'react';
import type React from 'react';

// All scroll-reveal animations removed — elements render instantly visible.

export const REVEAL_TRANSITION = '';

export function useReveal(_delay = 0, _threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const style: React.CSSProperties = {};
  return { ref, style };
}

export const REVEAL_STYLE: React.CSSProperties = {};
