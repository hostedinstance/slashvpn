/**
 * Input компонент для форм
 * 
 * Универсальный компонент input с поддержкой:
 * - Label и placeholder
 * - Сообщения об ошибках
 * - Helper text
 * - Иконки
 * - Различные состояния (disabled, error, etc.)
 */

'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label для input */
  label?: string;
  /** Сообщение об ошибке */
  error?: string;
  /** Вспомогательный текст под input */
  helperText?: string;
  /** Иконка слева */
  leftIcon?: React.ReactNode;
  /** Иконка справа */
  rightIcon?: React.ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

/**
 * Input компонент с поддержкой ref
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      wrapperClassName,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-white mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper для иконок */}
        <div className="relative">
          {/* Левая иконка */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // Базовые стили
              'w-full px-4 py-3 rounded-lg transition-all duration-200',
              'text-white placeholder:text-white/40',
              'focus:outline-none focus:ring-2',
              
              // Фон и border
              'bg-white/5 border border-white/10',
              
              // Состояние focus
              'focus:border-white/30 focus:ring-white/20',
              
              // Состояние error
              hasError && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
              
              // Состояние disabled
              disabled && 'opacity-50 cursor-not-allowed',
              
              // Отступы для иконок
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              
              className
            )}
            {...props}
          />

          {/* Правая иконка */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p className="mt-2 text-sm text-white/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
