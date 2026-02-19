/**
 * Input компонент для форм
 */

'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

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

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // Базовые стили
              'w-full px-4 py-3 rounded-lg',
              'text-white placeholder:text-white/40',
              'bg-white/5 border border-white/10',

              // Плавная анимация только нужных свойств.
              // transition-all анимирует box-shadow резко (ring прыгает 0→2px).
              // Анимируем только border-color и box-shadow раздельно с ease-out.
              'transition-[border-color,box-shadow] duration-300 ease-out',

              // Focus: убираем стандартный outline, рисуем свой через ring с offset=0
              'outline-none',
              'focus:border-white/40',
              'focus:ring-2 focus:ring-white/15 focus:ring-offset-0',

              // Error
              hasError && 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/20',

              // Disabled
              disabled && 'opacity-50 cursor-not-allowed',

              // Иконки
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',

              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-2 text-sm text-white/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
