"use client";

// Page transition animations removed — components render instantly.
// PageTransition is kept as a plain wrapper so imports don't break.

import { type ReactNode } from "react";

interface TransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: TransitionProps) {
  return <div className={className}>{children}</div>;
}

export function TransitionItem({ children, className }: TransitionProps) {
  return <div className={className}>{children}</div>;
}

// Keep Variants export so any leftover imports don't break at runtime
export const pageVariants = {};
export const itemVariants = {};
