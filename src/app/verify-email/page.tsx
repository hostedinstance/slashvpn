/**
 * Страница верификации email (АДАПТИРОВАННАЯ)
 * 
 * Теперь работает только с email (без userId)
 * Путь: /verify-email
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EmailVerificationForm } from '@/components/auth/EmailVerificationForm';
import { cn } from '@/lib/utils';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Получить email из URL параметров
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');

    // Если нет email, перенаправить на регистрацию
    if (!emailParam) {
      router.push('/register');
      return;
    }

    setEmail(emailParam);
  }, [searchParams, router]);

  /**
   * Обработка успешной верификации
   */
  const handleSuccess = () => {
    // Перенаправить на dashboard или главную страницу
    router.push('/dashboard');
  };

  /**
   * Обработка изменения email (возврат на регистрацию)
   */
  const handleChangeEmail = () => {
    router.push('/register');
  };

  // Показать loading пока загружаются параметры
  if (!email) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </main>
    );
  }

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
          <EmailVerificationForm
            email={email}
            onSuccess={handleSuccess}
            onChangeEmail={handleChangeEmail}
          />
        </div>

        {/* Футер */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/40">
            Если у вас возникли проблемы, свяжитесь с поддержкой
          </p>
        </div>
      </div>
    </main>
  );
}
