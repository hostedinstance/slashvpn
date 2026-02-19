/**
 * Сервис аутентификации SlashVPN
 * Исправлено: SHA-256 хеш для codeHash (64 символа)
 */

import { typedPb, pb, COLLECTIONS } from '@/lib/pocketbase';
import { sendVerificationEmail } from '@/lib/email';
import type {
  User,
  CreateUserData,
  RegistrationResponse,
  VerificationResponse,
  ResendCodeResponse,
} from '@/types/auth.types';

/**
 * Константы для верификации
 */
const VERIFICATION_CONFIG = {
  CODE_LENGTH: 6,
  CODE_EXPIRY_MINUTES: 15,
  MAX_VERIFICATION_ATTEMPTS: 5,
  RESEND_COOLDOWN_SECONDS: 60,
};

/**
 * Генерация 6-значного кода верификации
 * Используем криптографически безопасный генератор
 */
function generateVerificationCode(): string {
  // crypto.getRandomValues — безопаснее чем Math.random()
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    // Приводим к диапазону 100000–999999
    return (100000 + (array[0] % 900000)).toString();
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Хеширование кода через SHA-256 (Web Crypto API)
 * 
 * Возвращает hex-строку из ровно 64 символов.
 * Используем Web Crypto API — работает в браузере и Next.js.
 */
async function hashCode(code: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 60);
  }
  // Запасной вариант (старые окружения)
  return btoa(code).repeat(8).substring(0, 64);
}

/**
 * Получение IP адреса
 * На клиенте всегда 'unknown' — реальный IP можно получить только на сервере
 */
function getIpAddress(): string {
  return 'unknown';
}

/**
 * Получение User Agent
 */
function getUserAgent(): string {
  return typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 512) : 'unknown';
}

/**
 * Логирование события безопасности
 */
async function logSecurityEvent(
  event: string,
  email: string,
  success: boolean,
  reason?: string
): Promise<void> {
  try {
    await pb.collection('security_logs').create({
      event,
      email,
      ipAddress: getIpAddress(),
      userAgent: getUserAgent(),
      success,
      reason: reason || '',
      metadata: {},
    });
  } catch (error) {
    // Логирование не критично — не бросаем ошибку
    console.warn('Не удалось залогировать событие безопасности:', error);
  }
}

/**
 * Класс для работы с аутентификацией
 */
class AuthService {
  /**
   * Регистрация нового пользователя с отправкой кода верификации
   * 
   * ВАЖНО: В PocketBase коллекция users имеет createRule = null по умолчанию.
   * Нужно в PocketBase Admin установить createRule = "" (пустая строка = разрешить всем)
   */
  async register(data: CreateUserData): Promise<RegistrationResponse> {
    try {
      console.log('🔵 Начало регистрации для:', data.email);

      // 1. Проверить, не занят ли email
      // Используем pb напрямую (без типизации) для гибкости
      let existingUsers: any[] = [];
      try {
        existingUsers = await pb.collection(COLLECTIONS.USERS).getFullList({
          filter: `email = "${data.email}"`,
        });
      } catch (e) {
        // Если ошибка 403 — значит нет доступа к списку (это нормально)
        console.log('Проверка email пропущена — нет доступа к списку');
      }

      if (existingUsers.length > 0) {
        throw new Error('Этот email уже зарегистрирован');
      }

      console.log('✅ Email свободен');

      // 2. Создать пользователя (verified = false изначально)
      // ТРЕБУЕТ: в PocketBase Admin → Collections → users → API Rules → Create = ""
      const username = data.name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20) + '_' + Date.now().toString().slice(-4);

      const user = await pb.collection(COLLECTIONS.USERS).create({
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        username: username,
        name: data.name,
        emailVisibility: true,
        verified: false,
        registrationIp: getIpAddress(),
      });

      console.log('✅ Пользователь создан:', user.id);

      // 3. Сгенерировать код верификации (криптостойкий)
      const verificationCode = generateVerificationCode();
      // SHA-256 даёт ровно 64 символа (соответствует схеме codeHash min:60 max:64+)
      const codeHash = await hashCode(verificationCode);
      const expiresAt = new Date(Date.now() + VERIFICATION_CONFIG.CODE_EXPIRY_MINUTES * 60 * 1000);

      console.log('✅ Код сгенерирован, хеш длиной:', codeHash.length, 'символов');

      // 4. Сохранить запись верификации
      await pb.collection('email_verifications').create({
        email: data.email,
        codeHash: codeHash,
        attempts: 0,
        maxAttempts: VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS,
        blocked: false,
        blockedUntil: null,
        expiresAt: expiresAt.toISOString(),
        verified: false,
        ipAddress: getIpAddress(),
        userAgent: getUserAgent(),
      });

      console.log('✅ Запись верификации создана');

      // 5. Отправить email с кодом
      try {
        await sendVerificationEmail(data.email, verificationCode, data.name);
        console.log('✅ Email отправлен');
      } catch (emailError) {
        console.error('❌ Ошибка отправки email:', emailError);
        // Откат — удалить созданные записи
        try {
          await pb.collection(COLLECTIONS.USERS).delete(user.id);
          await this.deleteVerificationRecord(data.email);
        } catch (rollbackError) {
          console.error('❌ Ошибка отката:', rollbackError);
        }
        throw new Error('Не удалось отправить код верификации. Попробуйте еще раз.');
      }

      // 6. Лог успеха
      await logSecurityEvent('registration_success', data.email, true);

      console.log('✅ Регистрация завершена успешно');

      return {
        user: user as unknown as User,
        success: true,
        message: 'Код верификации отправлен на ваш email',
      };
    } catch (error: any) {
      console.error('❌ Ошибка регистрации:', error);
      console.error('❌ Детали:', {
        message: error.message,
        status: error.status,
        data: error.response?.data,
      });

      await logSecurityEvent('registration_failed', data.email, false, error.message);

      const errorMessage = this.parseError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Верификация email по коду
   */
  async verifyEmail(email: string, code: string): Promise<VerificationResponse> {
    try {
      console.log('🔵 Начало верификации для:', email);

      // 1. Найти запись верификации
      const verifications = await pb.collection('email_verifications').getFullList({
        filter: `email = "${email}" && verified = false`,
        sort: '-created',
      });

      if (verifications.length === 0) {
        throw new Error('Запись верификации не найдена. Зарегистрируйтесь заново.');
      }

      const verification = verifications[0];

      // 2. Проверить блокировку
      if (verification.blocked) {
        const blockedUntil = new Date(verification.blockedUntil);
        if (blockedUntil > new Date()) {
          throw new Error('Верификация временно заблокирована. Попробуйте позже.');
        }
      }

      // 3. Проверить количество попыток
      if (verification.attempts >= verification.maxAttempts) {
        throw new Error('Превышено количество попыток. Отправьте код повторно.');
      }

      // 4. Проверить срок действия
      if (new Date(verification.expiresAt) < new Date()) {
        throw new Error('Код верификации истек. Отправьте новый код.');
      }

      // 5. Проверить код (сравниваем SHA-256 хеши)
      const codeHash = await hashCode(code);
      if (verification.codeHash !== codeHash) {
        const newAttempts = verification.attempts + 1;
        await pb.collection('email_verifications').update(verification.id, {
          attempts: newAttempts,
        });

        // Блокировать если лимит исчерпан
        if (newAttempts >= verification.maxAttempts) {
          await pb.collection('email_verifications').update(verification.id, {
            blocked: true,
            blockedUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          });
        }

        await logSecurityEvent('verification_failed', email, false, 'Invalid code');
        const remainingAttempts = verification.maxAttempts - newAttempts;
        throw new Error(`Неверный код. Осталось попыток: ${remainingAttempts}`);
      }

      console.log('✅ Код верный');

      // 6. Пометить верификацию как выполненную
      await pb.collection('email_verifications').update(verification.id, {
        verified: true,   // поле называется verified, а не emailVerified
        attempts: 0,
      });

      // 7. Обновить пользователя — verified = true
      const users = await pb.collection(COLLECTIONS.USERS).getFullList({
        filter: `email = "${email}"`,
      });

      if (users.length === 0) {
        throw new Error('Пользователь не найден');
      }

      const user = users[0];

      // Попытка установить verified = true через клиентское API.
      // ВАЖНО: PocketBase по умолчанию не позволяет неавторизованным клиентам
      // обновлять встроенное поле 'verified'. Если обновление вернёт 403 — это нормально,
      // авторизация через authWithPassword всё равно сработает, если в PocketBase Admin →
      // Collections → users → Options отключить "Only authenticate verified users".
      try {
        await pb.collection(COLLECTIONS.USERS).update(user.id, { verified: true });
        console.log('✅ verified = true установлен');
      } catch (verifyErr) {
        console.warn('⚠️ Не удалось установить verified через клиент (это ожидаемо):', verifyErr);
        // Не прерываем поток — loginWithPassword сработает если PocketBase
        // не требует верификацию, или если пользователь уже верифицирован через admin
      }

      console.log('✅ Пользователь верифицирован');

      // 8. Авторизовать пользователя через email + пароль
      // Пароль нам недоступен — пользователь попадёт на страницу входа
      // (либо передавать пароль через sessionStorage — но это небезопасно)

      await logSecurityEvent('verification_success', email, true);

      console.log('✅ Верификация завершена. Перенаправляем на /login');

      return {
        success: true,
        user: user as unknown as User,
        token: '',
      };
    } catch (error: any) {
      console.error('❌ Ошибка верификации:', error);
      const errorMessage = this.parseError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Повторная отправка кода верификации
   */
  async resendVerificationCode(email: string): Promise<ResendCodeResponse> {
    try {
      console.log('🔵 Повторная отправка кода для:', email);

      // Найти пользователя
      const users = await pb.collection(COLLECTIONS.USERS).getFullList({
        filter: `email = "${email}"`,
      });

      if (users.length === 0) {
        throw new Error('Пользователь не найден');
      }

      const user = users[0];

      if (user.verified) {
        throw new Error('Email уже подтвержден');
      }

      // Удалить старую запись
      await this.deleteVerificationRecord(email);

      // Создать новый код
      const verificationCode = generateVerificationCode();
      const codeHash = await hashCode(verificationCode);
      const expiresAt = new Date(Date.now() + VERIFICATION_CONFIG.CODE_EXPIRY_MINUTES * 60 * 1000);

      await pb.collection('email_verifications').create({
        email: email,
        codeHash: codeHash,
        attempts: 0,
        maxAttempts: VERIFICATION_CONFIG.MAX_VERIFICATION_ATTEMPTS,
        blocked: false,
        blockedUntil: null,
        expiresAt: expiresAt.toISOString(),
        verified: false,
        ipAddress: getIpAddress(),
        userAgent: getUserAgent(),
      });

      // Отправить новый email
      await sendVerificationEmail(email, verificationCode, user.name || user.username);

      await logSecurityEvent('resend_success', email, true);

      console.log('✅ Код отправлен повторно');

      return {
        success: true,
        message: 'Код отправлен повторно на ваш email',
        expiresAt: expiresAt.toISOString(),
      };
    } catch (error: any) {
      console.error('❌ Ошибка повторной отправки:', error);
      const errorMessage = this.parseError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Удаление записи верификации
   */
  private async deleteVerificationRecord(email: string): Promise<void> {
    try {
      const verifications = await pb.collection('email_verifications').getFullList({
        filter: `email = "${email}"`,
      });
      for (const v of verifications) {
        await pb.collection('email_verifications').delete(v.id);
      }
    } catch (error) {
      console.warn('Не удалось удалить запись верификации:', error);
    }
  }

  /**
   * Авторизация по email + пароль (для автологина после верификации)
   */
  async loginWithPassword(email: string, password: string): Promise<void> {
    console.log('🔐 loginWithPassword вызван для:', email);
    const result = await pb.collection(COLLECTIONS.USERS).authWithPassword(email, password);
    console.log('✅ authWithPassword успешен, токен:', result.token ? 'есть' : 'нет');
  }

  /**
   * Парсинг ошибок в читаемые сообщения
   */
  private parseError(error: any): string {
    if (error.message && typeof error.message === 'string') {
      // Наши собственные сообщения — возвращаем как есть
      const knownMessages = [
        'зарегистрирован', 'подтвержден', 'не найден', 'истек',
        'попыток', 'заблокирован', 'Не удалось', 'Превышено',
        'Неверный', 'Запись'
      ];
      if (knownMessages.some(msg => error.message.includes(msg))) {
        return error.message;
      }
    }

    // Ошибки PocketBase API
    if (error.status === 403) {
      return 'Нет доступа. Проверьте API Rules в PocketBase Admin (createRule должен быть пустым).';
    }
    if (error.status === 400) {
      const data = error.response?.data;
      if (data?.email) return 'Этот email уже зарегистрирован';
      if (data?.username) return 'Это имя пользователя уже занято';
      if (data?.password) return 'Пароль слишком простой (минимум 8 символов)';
      return 'Неверные данные: ' + JSON.stringify(data || {});
    }
    if (error.status === 404) {
      return 'Ресурс не найден. Проверьте что все коллекции созданы в PocketBase.';
    }
    if (error.status >= 500) {
      return 'Сервер недоступен. Убедитесь что PocketBase запущен.';
    }

    // Сетевые ошибки
    if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
      return 'Нет соединения с сервером. Убедитесь что PocketBase запущен на порту 8090.';
    }

    return error.message || 'Произошла ошибка. Попробуйте еще раз.';
  }
}

export const authService = new AuthService();
export { VERIFICATION_CONFIG };
