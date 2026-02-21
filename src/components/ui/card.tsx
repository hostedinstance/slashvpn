'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type CardVariant = 'default' | 'raised' | 'ghost' | 'accent';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?:  CardVariant;
  hover?:    boolean;
  children:  ReactNode;
  padding?:  'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// ── Style Maps ────────────────────────────────────────────────────────────────

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-surface-raised shadow-soft shadow-inner-top',
  raised:  'bg-surface-overlay shadow-soft shadow-inner-top',
  ghost:   'bg-white/[0.03]',
  accent:  'bg-accent-subtle shadow-glow-sm',
};

const paddingStyles = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
  xl:   'p-10 md:p-12',
};

// ── Component ─────────────────────────────────────────────────────────────────

export function Card({
  variant  = 'default',
  hover    = false,
  padding  = 'lg',
  children,
  className = '',
  ...props
}: CardProps) {
  const base = [
    'rounded-squircle overflow-hidden',
    variantStyles[variant],
    paddingStyles[padding],
    hover ? 'transition-all duration-300 cursor-pointer' : '',
    className,
  ].join(' ');

  return (
    <motion.div
      className={base}
      whileHover={hover ? { y: -4, scale: 1.005 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────

export function CardDivider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-surface-border ${className}`} />;
}
