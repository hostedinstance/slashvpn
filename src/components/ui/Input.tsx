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

// Fixed border-radius so it NEVER changes on focus
const RADIUS = 12;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, wrapperClassName, required, disabled, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium mb-2 font-inter-tight"
            style={{ color: 'rgba(190,210,255,0.60)' }}
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(180,200,255,0.38)' }}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 font-inter-tight text-sm',
              'outline-none',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              disabled && 'opacity-40 cursor-not-allowed',
              className
            )}
            style={{
              borderRadius: RADIUS,
              // Static border + background — never change on focus via className
              background: hasError ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${hasError ? 'rgba(239,68,68,0.40)' : 'rgba(255,255,255,0.10)'}`,
              color: 'rgba(220,235,255,0.90)',
              // Transition only box-shadow — no border, no bg, so nothing "pops"
              transition: 'box-shadow 0.22s ease',
            }}
            onFocus={e => {
              // Soft white glow — no color change, no radius change
              e.currentTarget.style.boxShadow = hasError
                ? '0 0 0 3px rgba(239,68,68,0.18)'
                : '0 0 0 3px rgba(255,255,255,0.08), inset 0 1px 2px rgba(255,255,255,0.04)';
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(180,200,255,0.38)' }}>
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-400 font-inter-tight flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-2 text-xs font-inter-tight" style={{ color: 'rgba(180,200,255,0.36)' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
