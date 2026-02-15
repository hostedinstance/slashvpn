/**
 * Компонент формы регистрации (АДАПТИРОВАННЫЙ)
 * 
 * Адаптирован под структуру с отдельными таблицами
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, User } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';
import { registrationSchema, type RegistrationFormData } from '@/lib/validation';
import { cn } from '@/lib/utils';

export interface RegistrationFormProps {
  /** Callback после успешной регистрации */
  onSuccess?: (email: string) => void;
  /** Дополнительные классы для контейнера */
  className?: string;
}

/**
 * Форма регистрации пользователя
 */
export function RegistrationForm({ onSuccess, className }: RegistrationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange', // Валидация в реальном времени
  });

  const password = watch('password', '');

  /**
   * Обработка отправки формы
   */
  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);

    try {
      // Регистрация пользователя
      const response = await authService.register({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      // Показать успешное сообщение
      toast.success('Код отправлен на ваш email!', {
        duration: 4000,
      });

      // Перенаправить на страницу верификации или вызвать callback
      if (onSuccess) {
        onSuccess(data.email);
      } else {
        // ИЗМЕНЕНО: Передаем только email (без userId)
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error: any) {
      console.error('Ошибка регистрации:', error);
      toast.error(error.message || 'Не удалось зарегистрироваться', {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('w-full max-w-md', className)}>
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">
          Создать аккаунт
        </h1>
        <p className="text-white/60">
          Присоединяйтесь к SlashVPN и получите безопасный доступ к интернету
        </p>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="example@mail.com"
          error={errors.email?.message}
          disabled={isLoading}
          leftIcon={<Mail className="w-5 h-5" />}
          {...register('email')}
          required
        />

        {/* Имя */}
        <Input
          label="Полное имя"
          type="text"
          placeholder="Иван Иванов"
          error={errors.name?.message}
          disabled={isLoading}
          leftIcon={<User className="w-5 h-5" />}
          {...register('name')}
          required
        />

        {/* Пароль */}
        <PasswordInput
          label="Пароль"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isLoading}
          showRequirements={true}
          {...register('password')}
          value={password}
          required
        />

        {/* Подтверждение пароля */}
        <Input
          label="Подтвердите пароль"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          {...register('confirmPassword')}
          required
        />

        {/* Согласие с условиями */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptTerms"
            disabled={isLoading}
            className={cn(
              'mt-1 h-4 w-4 rounded border-white/30',
              'bg-white/5 text-white',
              'focus:ring-2 focus:ring-white/50 focus:ring-offset-0',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            {...register('acceptTerms')}
          />
          <label
            htmlFor="acceptTerms"
            className="ml-3 text-sm text-white/70 leading-relaxed"
          >
            Я принимаю{' '}
            <a
              href="/terms"
              target="_blank"
              className="text-white hover:underline font-medium"
            >
              условия использования
            </a>{' '}
            и{' '}
            <a
              href="/privacy"
              target="_blank"
              className="text-white hover:underline font-medium"
            >
              политику конфиденциальности
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-400 -mt-2 ml-7">
            {errors.acceptTerms.message}
          </p>
        )}

        {/* Кнопка отправки */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>

        {/* Ссылка на логин */}
        <p className="text-center text-sm text-white/60">
          Уже есть аккаунт?{' '}
          <a
            href="/login"
            className="text-white hover:underline font-medium"
          >
            Войти
          </a>
        </p>
      </form>
    </div>
  );
}
