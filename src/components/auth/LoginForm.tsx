'use client';

/**
 * LoginForm
 * ─────────────────────────────────────────────────────────────────────────────
 * Props (все опциональны — дефолты берутся из forms.login в site.config.ts):
 *
 *   title        — заголовок формы
 *   subtitle     — подзаголовок
 *   submitLabel  — текст кнопки отправки
 *   loadingLabel — текст кнопки во время запроса
 *   redirectTo   — куда перейти после успешного входа
 *   registerHref — ссылка на регистрацию
 */

import { useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { Loader2, LogIn } from 'lucide-react';
import { useNavigate } from '@/components/NavigationTransition';
import { forms } from '@/config/site.config';

export interface LoginFormProps {
  /** Заголовок формы. Дефолт: forms.login.title из site.config */
  title?: string;
  /** Подзаголовок. Дефолт: forms.login.subtitle */
  subtitle?: string;
  /** Текст кнопки. Дефолт: forms.login.submitLabel */
  submitLabel?: string;
  /** Текст кнопки при загрузке. Дефолт: forms.login.loadingLabel */
  loadingLabel?: string;
  /** Куда перейти после входа. Дефолт: forms.login.redirectTo */
  redirectTo?: string;
  /** Ссылка на регистрацию. Дефолт: forms.login.registerHref */
  registerHref?: string;
}

export function LoginForm({
  title        = forms.login.title,
  subtitle     = forms.login.subtitle,
  submitLabel  = forms.login.submitLabel,
  loadingLabel = forms.login.loadingLabel,
  redirectTo   = forms.login.redirectTo,
  registerHref = forms.login.registerHref,
}: LoginFormProps = {}) {
  const { navigate } = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Введите email адрес'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Некорректный email адрес'); return; }
    if (!password) { setError('Введите пароль'); return; }

    setLoading(true);
    setError(null);

    try {
      await pb.collection('users').authWithPassword(email, password);
      navigate(redirectTo);
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e.status === 400) {
        setError('Неверный email или пароль');
      } else if (e.status === 403) {
        setError('Email не подтверждён. Завершите регистрацию.');
      } else if (e.message?.includes('Failed to fetch')) {
        setError('PocketBase недоступен. Убедитесь что сервер запущен.');
      } else {
        setError(e.message || 'Произошла ошибка. Попробуйте еще раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Шапка */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.07] border border-white/[0.1] mb-5">
          <LogIn className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1 font-wix-madefor">{title}</h1>
        <p className="text-white/45 text-sm font-inter-tight">{subtitle}</p>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Поля */}
      <div className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-white/60 mb-1.5 font-inter-tight">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            disabled={loading}
            autoComplete="email"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-white/60 mb-1.5 font-inter-tight">
            Пароль
          </label>
          <PasswordInput
            id="login-password"
            placeholder="Ваш пароль"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            disabled={loading}
            autoComplete="current-password"
          />
        </div>
      </div>

      {/* Кнопка */}
      <AuthButton type="submit" className="w-full" size="lg" disabled={loading}>
        {loading
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{loadingLabel}</>
          : submitLabel}
      </AuthButton>

      {/* Ссылка на регистрацию */}
      <p className="text-center text-sm text-white/45 font-inter-tight">
        Нет аккаунта?{' '}
        <button
          type="button"
          onClick={() => navigate(registerHref)}
          className="text-white hover:text-white/80 transition-colors underline underline-offset-2"
        >
          Зарегистрироваться
        </button>
      </p>

    </form>
  );
}
