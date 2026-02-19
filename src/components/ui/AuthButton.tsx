/**
 * AuthButton — кнопка для форм аутентификации
 *
 * Отдельный компонент потому что Button.tsx — это анимированная ссылка (<a>),
 * а для форм нужен настоящий <button> с type="submit" / type="button" и onClick.
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
  ...props
}: AuthButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black font-inter-tight tracking-tight';

  const variants = {
    primary: 'bg-white text-black hover:bg-white/90 focus:ring-white disabled:bg-white/30 disabled:text-black/40',
    outline: 'border border-white/20 text-white hover:bg-white/10 focus:ring-white/50 disabled:opacity-40',
    ghost: 'text-white/60 hover:text-white focus:ring-white/30 disabled:opacity-40',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={twMerge(base, variants[variant], sizes[size], disabled && 'cursor-not-allowed', className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
