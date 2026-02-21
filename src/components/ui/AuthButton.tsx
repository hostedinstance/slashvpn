'use client';

/**
 * AuthButton
 *
 * primary — прозрачный navy-синий (rgba(1,20,74)), рамка rgba(100,140,255,0.22)
 *           при hover: scale(1.03) + синяя тень + чуть светлее фон
 * outline — тонкая рамка, аналогичный hover
 * ghost   — только текст
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function AuthButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  style,
  ...props
}: AuthButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl select-none focus:outline-none font-inter-tight tracking-tight';

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-[15px]',
  };

  /* ── primary ── */
  if (variant === 'primary') {
    return (
      <button
        className={twMerge(
          base, sizes[size],
          'relative overflow-hidden text-white disabled:opacity-40 disabled:cursor-not-allowed',
          className,
        )}
        disabled={disabled}
        style={{
          background: disabled
            ? 'rgba(0,30,80,0.35)'
            : 'rgba(1,20,74,0.70)',
          border: '1px solid rgba(100,140,255,0.22)',
          boxShadow: disabled
            ? 'none'
            : '0 2px 12px rgba(0,40,140,0.18), inset 0 1px 0 rgba(100,140,255,0.12)',
          /* CSS transition — стабильно работает параллельно */
          transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease, background 200ms ease, border-color 200ms ease',
          ...style,
        }}
        onMouseEnter={(e) => {
          if (disabled) return;
          const el = e.currentTarget as HTMLElement;
          el.style.background   = 'rgba(0,30,100,0.85)';
          el.style.borderColor  = 'rgba(100,160,255,0.45)';
          el.style.boxShadow    = '0 6px 22px rgba(0,60,180,0.32), 0 1px 0 rgba(100,160,255,0.20) inset';
          el.style.transform    = 'scale(1.03) translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          if (disabled) return;
          const el = e.currentTarget as HTMLElement;
          el.style.background   = 'rgba(1,20,74,0.70)';
          el.style.borderColor  = 'rgba(100,140,255,0.22)';
          el.style.boxShadow    = '0 2px 12px rgba(0,40,140,0.18), inset 0 1px 0 rgba(100,140,255,0.12)';
          el.style.transform    = 'scale(1) translateY(0)';
        }}
        onMouseDown={(e) => {
          if (disabled) return;
          (e.currentTarget as HTMLElement).style.transform = 'scale(0.98) translateY(0)';
        }}
        onMouseUp={(e) => {
          if (disabled) return;
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.03) translateY(-1px)';
        }}
        {...props}
      >
        {/* Subtle top shimmer */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(100,160,255,0.22), transparent)' }}
        />
        {children}
      </button>
    );
  }

  /* ── outline ── */
  if (variant === 'outline') {
    return (
      <button
        className={twMerge(base, sizes[size], 'disabled:opacity-35 disabled:cursor-not-allowed', className)}
        disabled={disabled}
        style={{
          border: '1px solid rgba(100,140,255,0.20)',
          background: 'rgba(1,14,56,0.30)',
          color: 'rgba(180,205,255,0.75)',
          transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease, background 200ms ease, border-color 200ms ease',
          ...style,
        }}
        onMouseEnter={(e) => {
          if (disabled) return;
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor  = 'rgba(100,160,255,0.40)';
          el.style.background   = 'rgba(0,30,100,0.45)';
          el.style.color        = 'rgba(210,228,255,0.95)';
          el.style.boxShadow    = '0 4px 16px rgba(0,50,160,0.22)';
          el.style.transform    = 'scale(1.025)';
        }}
        onMouseLeave={(e) => {
          if (disabled) return;
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor  = 'rgba(100,140,255,0.20)';
          el.style.background   = 'rgba(1,14,56,0.30)';
          el.style.color        = 'rgba(180,205,255,0.75)';
          el.style.boxShadow    = 'none';
          el.style.transform    = 'scale(1)';
        }}
        {...props}
      >
        {children}
      </button>
    );
  }

  /* ── ghost ── */
  return (
    <button
      className={twMerge(base, sizes[size], 'disabled:opacity-35 disabled:cursor-not-allowed', className)}
      disabled={disabled}
      style={{
        color: 'rgba(180,205,255,0.55)',
        background: 'transparent',
        transition: 'color 160ms ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLElement).style.color = 'rgba(210,228,255,0.90)';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLElement).style.color = 'rgba(180,205,255,0.55)';
      }}
      {...props}
    >
      {children}
    </button>
  );
}
