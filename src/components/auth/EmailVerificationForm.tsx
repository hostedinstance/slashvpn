/**
 * Форма верификации email
 * Навигация через useRouter — никаких function props (TS71007)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Input } from '@/components/ui/Input';
import { AuthButton } from '@/components/ui/AuthButton';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { useNavigate } from '@/components/NavigationTransition';
import { forms } from '@/config/site.config';

export interface EmailVerificationFormProps {
  /** Email пользователя — обязательный */
  email: string;
  /** Заголовок формы. Дефолт: forms.verifyEmail.title */
  title?: string;
  /** Подзаголовок. Дефолт: forms.verifyEmail.subtitle */
  subtitle?: string;
  /** Куда перейти после подтверждения. Дефолт: forms.verifyEmail.redirectTo */
  redirectTo?: string;
}

export function EmailVerificationForm({
  email,
  title      = forms.verifyEmail.title,
  subtitle   = forms.verifyEmail.subtitle,
  redirectTo = forms.verifyEmail.redirectTo,
}: EmailVerificationFormProps) {
  const router = useRouter();
  const { navigate } = useNavigate();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
      await authService.verifyEmail(email, codeToVerify);
      console.log('✅ Email верифицирован');
      
      // Автологин после верификации
      const password = sessionStorage.getItem('_reg_pwd');
      console.log('🔑 Пароль из sessionStorage:', password ? 'найден' : 'НЕ найден');
      
      if (password) {
        sessionStorage.removeItem('_reg_pwd');
        try {
          console.log('🔐 Попытка автологина...');
          await authService.loginWithPassword(email, password);
          console.log('✅ Автологин успешен, редирект на /dashboard');
          navigate(redirectTo);
        } catch (err) {
          console.error('❌ Автологин не удался:', err);
          navigate('/login');
        }
      } else {
        console.log('⚠️ Пароль отсутствует, редирект на /login');
        navigate('/login');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при верификации');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await authService.resendVerificationCode(email);
      setResendCooldown(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить код повторно');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)"}}>
          <Mail className="w-7 h-7" style={{color:"rgba(255,255,255,0.80)"}} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 font-wix-madefor text-white">{title}</h1>
        <p className="text-sm font-inter-tight" style={{color:"rgba(255,255,255,0.45)"}}>{subtitle}</p>
        <p className="font-inter-tight font-semibold mt-1" style={{color:"rgba(255,255,255,0.85)"}}>{email}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-3 text-center font-inter-tight" style={{color:"rgba(255,255,255,0.52)"}}>
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
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Проверка...</> : 'Подтвердить'}
      </AuthButton>

      <div className="text-center space-y-3">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || resending}
          className="text-sm transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-2 font-inter-tight hover:text-white" style={{color:"rgba(255,255,255,0.55)"}}
        >
          <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
          {resendCooldown > 0 ? `Отправить снова через ${resendCooldown}с` : resending ? 'Отправка...' : 'Отправить код повторно'}
        </button>

      <div className="rounded-[14px] p-3" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.10)"}}>
        <p className="text-xs text-center font-inter-tight" style={{color:"rgba(255,255,255,0.40)"}}>
          💡 Код действителен 15 минут. Проверьте папку &quot;Спам&quot;.
        </p>
      </div>
    </div>
  </div>
  );
}
