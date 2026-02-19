/**
 * PasswordInput компонент
 * 
 * Специализированный input для пароля с:
 * - Переключением видимости пароля
 * - Отображением требований к паролю в реальном времени
 * - Индикатором силы пароля
 */

'use client';

import { forwardRef, useState, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './Input';
import type { PasswordRequirement } from '@/types/auth.types';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label для input */
  label?: string;
  /** Сообщение об ошибке */
  error?: string;
  /** Показывать ли требования к паролю */
  showRequirements?: boolean;
  /** Wrapper className */
  wrapperClassName?: string;
}

/**
 * Проверка требований к паролю
 */
function checkPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      label: 'Минимум 8 символов',
      met: password.length >= 8,
    },
    {
      label: 'Заглавная буква (A-Z)',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Цифра (0-9)',
      met: /[0-9]/.test(password),
    },
    {
      label: 'Спецсимвол (!@#$%^&*)',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

/**
 * PasswordInput компонент с поддержкой ref
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      showRequirements = false,
      wrapperClassName,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const password = (value as string) || '';
    const requirements = checkPasswordRequirements(password);
    const allRequirementsMet = requirements.every((req) => req.met);

    // Иконка для переключения видимости
    const ToggleIcon = showPassword ? (
      // Иконка "скрыть"
      <svg
        className="w-5 h-5 cursor-pointer hover:text-white transition-colors"
        onClick={() => setShowPassword(!showPassword)}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    ) : (
      // Иконка "показать"
      <svg
        className="w-5 h-5 cursor-pointer hover:text-white transition-colors"
        onClick={() => setShowPassword(!showPassword)}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    );

    return (
      <div className={wrapperClassName}>
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          label={label}
          error={error}
          value={value}
          rightIcon={ToggleIcon}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Требования к паролю */}
        {showRequirements && isFocused && password && (
          <div className="mt-3 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs font-medium text-white/70 mb-3">
              Требования к паролю:
            </p>
            <ul className="space-y-2">
              {requirements.map((req, idx) => (
                <li
                  key={idx}
                  className={cn(
                    'text-xs flex items-center gap-2 transition-colors',
                    req.met ? 'text-green-400' : 'text-white/50'
                  )}
                >
                  {/* Иконка чекмарка или круга */}
                  {req.met ? (
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span>{req.label}</span>
                </li>
              ))}
            </ul>

            {/* Индикатор силы пароля */}
            {password.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70">
                    Сила пароля:
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      allRequirementsMet
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    )}
                  >
                    {allRequirementsMet ? 'Надежный' : 'Слабый'}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      allRequirementsMet
                        ? 'bg-green-400 w-full'
                        : 'bg-yellow-400 w-1/2'
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
