'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize    = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  children:  ReactNode;
  href?:     string;
  icon?:     ReactNode;
  iconRight?: boolean;
  fullWidth?: boolean;
  loading?:  boolean;
}

// ── Style Maps ────────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-accent text-white',
    'shadow-glow-sm hover:shadow-glow',
    'before:absolute before:inset-0 before:rounded-full',
    'before:bg-gradient-to-b before:from-white/15 before:to-transparent',
    'hover:bg-accent/90',
  ].join(' '),

  secondary: [
    'bg-surface-raised text-ink-primary',
    'shadow-inner-top',
    'hover:bg-surface-overlay',
  ].join(' '),

  ghost: [
    'bg-transparent text-ink-secondary',
    'hover:text-ink-primary hover:bg-white/5',
  ].join(' '),

  outline: [
    'bg-transparent text-ink-primary',
    'ring-1 ring-surface-border hover:ring-white/20',
    'hover:bg-white/4',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm:  'h-8  px-4  text-sm   gap-1.5',
  md:  'h-10 px-6  text-sm   gap-2',
  lg:  'h-12 px-8  text-base gap-2.5',
  xl:  'h-14 px-10 text-base gap-3',
};

// ── Component ─────────────────────────────────────────────────────────────────

export function Button({
  variant  = 'primary',
  size     = 'lg',
  children,
  href,
  icon,
  iconRight = false,
  fullWidth = false,
  loading   = false,
  className = '',
  ...props
}: ButtonProps) {
  const base = [
    'relative inline-flex items-center justify-center',
    'rounded-full font-inter-tight font-medium',
    'transition-all duration-200 ease-out',
    'cursor-pointer select-none overflow-hidden',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    fullWidth ? 'w-full' : '',
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(' ');

  const content = (
    <>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="size-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </span>
      )}
      <span className={`flex items-center gap-inherit ${loading ? 'opacity-0' : ''}`}>
        {icon && !iconRight && <span className="shrink-0">{icon}</span>}
        {children}
        {icon && iconRight && <span className="shrink-0">{icon}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={base}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={base}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}
