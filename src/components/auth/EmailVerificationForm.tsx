/**
 * Компонент формы верификации email (АДАПТИРОВАННЫЙ)
 * 
 * Адаптирован под структуру с отдельной таблицей email_verifications
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Clock, ArrowLeft } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService, VERIFICATION_CONFIG } from '@/services/auth.service';
import { cn } from '@/lib/utils';

export interface EmailVerificationFormProps {
  /** Email пользователя */
  email: string;
  /** Callback после успешной верификации */
  onSuccess?: () => void;
  /** Callback для изменения email */
  onChangeEmail?: () => void;
}

/**
 * Форма верификации email
 */
export function EmailVerificationForm({
  email,
  onSuccess,
  onChangeEmail,
}: EmailVerificationFormProps) {
  const router = useRouter();

  // Состояние кода
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Состояние повторной отправки
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Таймер
  const [timeLeft, setTimeLeft] = useState(
    VERIFICATION_CONFIG.CODE_EXPIRY_MINUTES * 60
  );

  /**
   * Таймер обратного отсчета
   */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /**
   * Таймер cooldown для повторной отправки
   */
  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        const newValue = Math.max(0, prev - 1);
        if (newValue === 0) {
          setCanResend(true);
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  /**
   * Форматирование времени (MM:SS)
   */
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Обработка ввода кода
   */
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Только цифры

    if (value.length <= 6) {
      setCode(value);

      // Автоотправка при 6 цифрах
      if (value.length === 6 && !isVerifying) {
        verifyCode(value);
      }
    }
  };

  /**
   * Верификация кода
   */
  const verifyCode = async (codeToVerify: string = code) => {
    if (codeToVerify.length !== 6) {
      toast.error('Введите 6-значный код');
      return;
    }

    if (attempts >= VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS) {
      toast.error('Превышено количество попыток. Отправьте код повторно');
      return;
    }

    setIsVerifying(true);
    setAttempts((prev) => prev + 1);

    try {
      // ИЗМЕНЕНО: Передаем email вместо userId
      await authService.verifyEmail(email, codeToVerify);

      toast.success('Email успешно подтвержден!', {
        icon: '✅',
        duration: 3000,
      });

      // Перенаправление или callback
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Ошибка верификации:', error);

      // Обработка различных ошибок
      if (error.message.includes('истек')) {
        toast.error('Код истек. Отправьте новый код');
        setTimeLeft(0);
      } else if (error.message.includes('попыток')) {
        toast.error(error.message);
      } else {
        const remainingAttempts =
          VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS - attempts;
        toast.error(
          `Неверный код. Осталось попыток: ${remainingAttempts}`
        );
      }

      // Очистить поле
      setCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Повторная отправка кода
   */
  const handleResendCode = async () => {
    if (!canResend || isResending) {
      if (resendCooldown > 0) {
        toast.error(`Подождите ${resendCooldown} секунд перед повторной отправкой`);
      }
      return;
    }

    setIsResending(true);

    try {
      await authService.resendVerificationCode(email);

      // Установить cooldown
      setCanResend(false);
      setResendCooldown(VERIFICATION_CONFIG.RESEND_COOLDOWN_SECONDS);
      
      // Сбросить таймер и попытки
      setTimeLeft(VERIFICATION_CONFIG.CODE_EXPIRY_MINUTES * 60);
      setAttempts(0);
      setCode('');

      toast.success('Код отправлен повторно на ' + email, {
        duration: 4000,
      });
    } catch (error: any) {
      console.error('Ошибка повторной отправки:', error);
      toast.error(error.message || 'Не удалось отправить код');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Иконка email */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full border border-white/20">
          <Mail className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Проверьте Email
        </h1>
        <p className="text-white/60 mb-2">
          Мы отправили код на
          <br />
          <span className="font-medium text-white">{email}</span>
        </p>
        {onChangeEmail && (
          <button
            onClick={onChangeEmail}
            className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Изменить email
          </button>
        )}
      </div>

      {/* Поле ввода кода */}
      <div className="space-y-6">
        <Input
          label="Код подтверждения"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          value={code}
          onChange={handleCodeChange}
          disabled={isVerifying || attempts >= VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS}
          className="text-center text-2xl font-mono tracking-[0.5em] font-bold"
          autoFocus
          maxLength={6}
        />

        <p className="text-xs text-white/50 text-center -mt-2">
          Введите 6-значный код из письма
        </p>

        {/* Кнопка верификации */}
        <Button
          type="button"
          onClick={() => verifyCode()}
          disabled={
            code.length !== 6 ||
            isVerifying ||
            attempts >= VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS
          }
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isVerifying}
        >
          {isVerifying ? 'Проверка...' : 'Подтвердить Email'}
        </Button>

        {/* Таймер */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-white/60 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Код действителен еще{' '}
              <span className="font-mono font-medium text-white">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <p className="text-sm text-red-400">
              ⚠️ Код истек. Отправьте новый код
            </p>
          )}
        </div>

        {/* Кнопка повторной отправки */}
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleResendCode}
            disabled={isResending || !canResend}
            isLoading={isResending}
            fullWidth
          >
            {isResending ? 'Отправка...' : 'Отправить код повторно'}
          </Button>

          {!canResend && resendCooldown > 0 && (
            <p className="text-xs text-white/50 mt-2">
              Повторная отправка через {resendCooldown} сек
            </p>
          )}

          <p className="text-xs text-white/50 mt-3">
            Не получили код? Проверьте папку "Спам"
          </p>
        </div>

        {/* Счетчик попыток */}
        {attempts > 0 && attempts < VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400 text-center">
              Неверных попыток: {attempts} из {VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS}
            </p>
          </div>
        )}

        {/* Превышен лимит попыток */}
        {attempts >= VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400 text-center">
              Превышено количество попыток.
              <br />
              Отправьте код повторно для продолжения.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
