/**
 * Страница регистрации
 * 
 * Next.js App Router страница для регистрации новых пользователей.
 * Путь: /register
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();

  /**
   * Обработка успешной регистрации
   */
  const handleSuccess = (email: string, userId: string) => {
    // Перенаправить на страницу верификации с параметрами
    router.push(`/verify-email?email=${encodeURIComponent(email)}&userId=${userId}`);
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Декоративный фон (опционально) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Контент */}
      <div className="relative z-10 w-full max-w-md">
        {/* Карточка с формой */}
        <div
          className={cn(
            'rounded-2xl p-8',
            'bg-gradient-to-b from-white/5 to-white/[0.02]',
            'border border-white/10',
            'backdrop-blur-xl',
            'shadow-2xl'
          )}
        >
          <RegistrationForm onSuccess={handleSuccess} />
        </div>

        {/* Футер */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/40">
            Нажимая "Зарегистрироваться", вы соглашаетесь с нашими условиями
          </p>
        </div>
      </div>
    </main>
  );
}
