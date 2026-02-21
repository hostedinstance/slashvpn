'use client';

/**
 * RegistrationForm
 * ─────────────────────────────────────────────────────────────────────────────
 * Props (все опциональны — дефолты из forms.register в site.config.ts):
 *
 *   title        — заголовок формы
 *   subtitle     — подзаголовок
 *   submitLabel  — текст кнопки отправки
 *   loadingLabel — текст кнопки во время запроса
 *   loginHref    — ссылка на вход
 */

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { Loader2, UserPlus } from 'lucide-react';
import type { CreateUserData } from '@/types/auth.types';
import { useNavigate } from '@/components/NavigationTransition';
import { forms } from '@/config/site.config';

export interface RegistrationFormProps {
  /** Заголовок. Дефолт: forms.register.title */
  title?: string;
  /** Подзаголовок. Дефолт: forms.register.subtitle */
  subtitle?: string;
  /** Текст кнопки. Дефолт: forms.register.submitLabel */
  submitLabel?: string;
  /** Текст кнопки при загрузке. Дефолт: forms.register.loadingLabel */
  loadingLabel?: string;
  /** Ссылка на вход. Дефолт: forms.register.loginHref */
  loginHref?: string;
}

export function RegistrationForm({
  title        = forms.register.title,
  subtitle     = forms.register.subtitle,
  submitLabel  = forms.register.submitLabel,
  loadingLabel = forms.register.loadingLabel,
  loginHref    = forms.register.loginHref,
}: RegistrationFormProps = {}) {
  const { navigate } = useNavigate();
  const [formData, setFormData] = useState<CreateUserData>({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkPasswordStrength = (password: string): string => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Слишком короткий';
    let s = 0;
    if (password.length >= 12) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (s < 3) return 'Слабый';
    if (s < 5) return 'Средний';
    return 'Сильный';
  };

  const handleChange = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    if (field === 'password') setPasswordStrength(checkPasswordStrength(value));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Введите ваше имя';
    if (!formData.email.trim()) return 'Введите email адрес';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Некорректный email адрес';
    if (!formData.password) return 'Введите пароль';
    if (formData.password.length < 8) return 'Пароль должен содержать минимум 8 символов';
    if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      return 'Пароль должен содержать буквы и цифры';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(formData);
      sessionStorage.setItem('_reg_pwd', formData.password);
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}&userId=${response.user.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = passwordStrength === 'Сильный' ? 'text-green-400'
    : passwordStrength === 'Средний' ? 'text-yellow-400'
    : 'text-red-400';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Шапка */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)"}}>
          <UserPlus className="w-7 h-7" style={{color:"rgba(255,255,255,0.80)"}} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 font-wix-madefor text-white">{title}</h1>
        <p className="text-sm font-inter-tight" style={{color:"rgba(255,255,255,0.45)"}}>{subtitle}</p>
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
          <label htmlFor="reg-name" className="block text-sm font-medium mb-1.5 font-inter-tight" style={{color:"rgba(255,255,255,0.52)"}}>Имя</label>
          <Input
            id="reg-name"
            type="text"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={loading}
            autoComplete="name"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium mb-1.5 font-inter-tight" style={{color:"rgba(255,255,255,0.52)"}}>Email</label>
          <Input
            id="reg-email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium mb-1.5 font-inter-tight" style={{color:"rgba(255,255,255,0.52)"}}>
            Пароль
          </label>
          <PasswordInput
            id="reg-password"
            placeholder="Минимум 8 символов"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />
          {passwordStrength && (
            <p className={`text-xs mt-1.5 ${strengthColor}`}>Сила пароля: {passwordStrength}</p>
          )}
        </div>
      </div>

      {/* Кнопка */}
      <AuthButton type="submit" className="w-full" size="lg" disabled={loading}>
        {loading
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{loadingLabel}</>
          : submitLabel}
      </AuthButton>

      {/* Ссылка на вход */}
      <p className="text-center text-sm font-inter-tight" style={{color:"rgba(255,255,255,0.40)"}}>
        Уже есть аккаунт?{' '}
        <button
          type="button"
          onClick={() => navigate(loginHref)}
          className="transition-colors duration-200 underline underline-offset-2 hover:text-white" style={{color:"rgba(255,255,255,0.75)"}}
        >
          Войти
        </button>
      </p>

      {/* Legal */}
      <p className="text-center text-[11px] leading-relaxed font-inter-tight" style={{color:"rgba(255,255,255,0.28)"}}>
        Нажимая «Зарегистрироваться», вы соглашаетесь с{' '}
        <a href="/terms" className="underline underline-offset-2 hover:text-white/90 transition-colors duration-200" style={{color:"rgba(210,225,255,0.55)"}}>
          Условиями использования
        </a>{' '}и{' '}
        <a href="/privacy" className="underline underline-offset-2 hover:text-white/90 transition-colors duration-200" style={{color:"rgba(210,225,255,0.55)"}}>
          Политикой конфиденциальности
        </a>
      </p>

    </form>
  );
}
