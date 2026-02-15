/**
 * Button компонент
 * 
 * ВАЖНО: Если в вашем проекте уже есть компонент Button,
 * используйте его вместо этого! Этот файл предоставлен
 * для справки и может быть удален.
 * 
 * Универсальный компонент кнопки с поддержкой:
 * - Различные варианты (primary, secondary, outline, ghost)
 * - Различные размеры
 * - Loading состояние
 * - Disabled состояние
 * - Иконки
 */

'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант кнопки */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg';
  /** Состояние загрузки */
  isLoading?: boolean;
  /** Иконка слева */
  leftIcon?: React.ReactNode;
  /** Иконка справа */
  rightIcon?: React.ReactNode;
  /** Полная ширина */
  fullWidth?: boolean;
  /** Ссылка (если нужна кнопка-ссылка) */
  href?: string;
}

/**
 * Button компонент
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      href,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // Базовые классы
    const baseClasses = cn(
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full'
    );

    // Варианты стилей
    const variantClasses = {
      primary: cn(
        'bg-white text-black',
        'hover:bg-white/90',
        'focus:ring-white/50'
      ),
      secondary: cn(
        'bg-white/10 text-white border border-white/20',
        'hover:bg-white/20',
        'focus:ring-white/50'
      ),
      outline: cn(
        'bg-transparent text-white border-2 border-white/30',
        'hover:bg-white/10',
        'focus:ring-white/50'
      ),
      ghost: cn(
        'bg-transparent text-white',
        'hover:bg-white/10',
        'focus:ring-white/50'
      ),
      destructive: cn(
        'bg-red-500 text-white',
        'hover:bg-red-600',
        'focus:ring-red-500/50'
      ),
    };

    // Размеры
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const buttonClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    // Спиннер загрузки
    const Spinner = () => (
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Если это ссылка
    if (href) {
      return (
        <a href={href} className={buttonClasses}>
          {isLoading && <Spinner />}
          {!isLoading && leftIcon}
          {children}
          {!isLoading && rightIcon}
        </a>
      );
    }

    // Обычная кнопка
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {isLoading && <Spinner />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
