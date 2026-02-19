/**
 * Валидация форм аутентификации
 * Без Zod — чистый TypeScript, чтобы не добавлять лишних зависимостей
 */

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Введите email адрес';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email адрес';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Введите пароль';
  if (password.length < 8) return 'Пароль должен содержать минимум 8 символов';
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Пароль должен содержать буквы и цифры';
  }
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return 'Введите ваше имя';
  if (name.trim().length < 2) return 'Имя слишком короткое';
  return null;
}

export function validateVerificationCode(code: string): string | null {
  if (!code) return 'Введите код верификации';
  if (!/^\d{6}$/.test(code)) return 'Код должен содержать 6 цифр';
  return null;
}
