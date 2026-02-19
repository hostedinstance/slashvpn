/**
 * Форма верификации кода при входе — шаг 2
 *
 * Исправлена проблема зацикливания:
 * Старый код: pb.authStore.save('passwordless-' + Date.now(), users[0])
 * Проблема: PocketBase SDK v0.21 декодирует JWT в isValid — фейковый токен
 *           не имеет поля exp → isTokenExpired = true → isValid = false →
 *           /dashboard редиректит обратно на /login → зацикливание.
 *
 * Исправление: после успешной проверки кода вызываем authWithPassword(email, password)
 * с паролем из sessionStorage (сохранён в LoginForm шаге 1).
 * authWithPassword возвращает реальный JWT → isValid = true → dashboard работает.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import { Input } from '@/components/ui/Input';
import { AuthButton } from '@/components/ui/AuthButton';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@/components/NavigationTransition';

interface LoginVerificationFormProps {
  email: string;
  onBack: () => void;
}

async function hashCode(code: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 60);
  }
  return btoa(code).repeat(8).substring(0, 64);
}

export function LoginVerificationForm({ email, onBack }: LoginVerificationFormProps) {
  const router = useRouter();
  const { navigate } = useNavigate();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newCode.every(d => d !== '') && value) handleVerify(newCode.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      setError(null);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    if (codeToVerify.length !== 6) { setError('Введите полный код из 6 цифр'); return; }

    setLoading(true);
    setError(null);

    try {
      // Шаг 1: найти активную запись кода входа
      const loginCodes = await pb.collection('login_codes').getFullList({
        filter: `email = "${email}" && used = false`,
        sort: '-created',
      });

      if (loginCodes.length === 0) {
        setError('Код не найден или уже использован. Получите новый код.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      const loginCode = loginCodes[0];

      // Шаг 2: проверить блокировку
      if (loginCode['blocked']) {
        setError('Слишком много попыток. Получите новый код.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      // Шаг 3: проверить срок действия
      if (new Date(loginCode['expiresAt'] as string) < new Date()) {
        setError('Код истёк. Получите новый код.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      // Шаг 4: сравнить хеши
      const codeHash = await hashCode(codeToVerify);
      if (loginCode['codeHash'] !== codeHash) {
        const newAttempts = (loginCode['attempts'] as number) + 1;
        const maxAttempts = loginCode['maxAttempts'] as number;
        await pb.collection('login_codes').update(loginCode['id'] as string, { attempts: newAttempts });

        if (newAttempts >= maxAttempts) {
          await pb.collection('login_codes').update(loginCode['id'] as string, { blocked: true });
          setError('Превышен лимит попыток. Получите новый код.');
        } else {
          setError(`Неверный код. Осталось попыток: ${maxAttempts - newAttempts}`);
        }
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      // Шаг 5: код верный — пометить как использованный
      await pb.collection('login_codes').update(loginCode['id'] as string, { used: true });

      // Шаг 6: получить реальный токен PocketBase через authWithPassword
      // Пароль был сохранён в LoginForm шаге 1.
      // authWithPassword возвращает настоящий JWT → pb.authStore.isValid = true →
      // dashboard корректно проверяет авторизацию без редиректа на /login.
      const password = sessionStorage.getItem('_login_pwd');

      if (!password) {
        // Пароль отсутствует (например, сессия истекла) — отправляем на логин
        setError('Сессия истекла. Войдите заново.');
        return;
      }

      sessionStorage.removeItem('_login_pwd');

      try {
        // Реальная авторизация через PocketBase — устанавливает валидный JWT токен
        await pb.collection('users').authWithPassword(email, password);
        console.log('✅ Авторизация успешна, переход на /dashboard');
        navigate('/dashboard');
      } catch (authErr: unknown) {
        const e = authErr as { status?: number; message?: string };
        console.error('❌ Ошибка authWithPassword:', authErr);

        if (e.status === 400) {
          // PocketBase вернул 400 — скорее всего требует подтверждения email
          // Нужно в PocketBase Admin → Collections → users → Options
          // отключить "Only authenticate verified users"
          setError('Ошибка авторизации. Убедитесь, что аккаунт активирован.');
        } else {
          setError('Ошибка входа. Попробуйте ещё раз.');
        }
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Произошла ошибка при входе');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Проверьте почту</h1>
        <p className="text-white/60 text-sm">Код отправлен на</p>
        <p className="text-white font-medium mt-1">{email}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white/80 mb-3 text-center">
          Введите 6-значный код
        </label>
        <div className="flex gap-2 justify-center">
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={loading}
              className="w-12 h-14 text-center text-xl font-bold"
              autoComplete="off"
            />
          ))}
        </div>
      </div>

      <AuthButton
        type="button"
        onClick={() => handleVerify()}
        className="w-full"
        size="lg"
        disabled={loading || code.some(d => !d)}
      >
        {loading
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Вход...</>
          : 'Войти'}
      </AuthButton>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Изменить email
        </button>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-blue-400 text-xs text-center">
          💡 Код действителен 15 минут. Проверьте папку &quot;Спам&quot;.
        </p>
      </div>
    </div>
  );
}
