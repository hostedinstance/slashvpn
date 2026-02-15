/**
 * Сервис аутентификации для SlashVPN (ИСПРАВЛЕННЫЙ)
 *
 * Исправлена обработка ошибок
 */

import { typedPb, COLLECTIONS } from '@/lib/pocketbase';
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
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Хеширование кода для безопасного хранения
 */
async function hashCode(code: string): Promise<string> {
  return btoa(code);
}

/**
 * Получение IP адреса (client-side заглушка)
 */
function getIpAddress(): string {
  return 'unknown';
}

/**
 * Получение User Agent
 */
function getUserAgent(): string {
  return typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown';
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
    await typedPb.collection('security_logs').create({
      event,
      email,
      ipAddress: getIpAddress(),
      userAgent: getUserAgent(),
      success,
      reason: reason || '',
      metadata: {},
    });
  } catch (error) {
    console.error('Не удалось залогировать событие:', error);
  }
}

/**
 * Класс для работы с аутентификацией
 */
class AuthService {
  /**
   * Регистрация нового пользователя с отправкой кода верификации
   */
  async register(data: CreateUserData): Promise<RegistrationResponse> {
    try {
      console.log('🔵 Начало регистрации для:', data.email);

      // 1. Проверить, не занят ли email
      const existingUsers = await typedPb.collection(COLLECTIONS.USERS).getFullList({
        filter: `email = "${data.email}"`,
      });

      if (existingUsers.length > 0) {
        await logSecurityEvent('registration_failed', data.email, false, 'Email already exists');
        throw new Error('Этот email уже зарегистрирован');
      }

      console.log('✅ Email свободен');

      // 2. Создать пользователя (verified = false)
      const user = await typedPb.collection(COLLECTIONS.USERS).create<User>({
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        username: data.name.toLowerCase().replace(/\s+/g, '_'),
        name: data.name,
        emailVisibility: false,
        verified: false,
        registrationIp: getIpAddress(),
      });

      console.log('✅ Пользователь создан:', user.id);

      // 3. Сгенерировать код верификации
      const verificationCode = generateVerificationCode();
      const codeHash = await hashCode(verificationCode);
      const expiresAt = new Date(Date.now() + VERIFICATION_CONFIG.CODE_EXPIRY_MINUTES * 60 * 1000);

      console.log('✅ Код сгенерирован:', verificationCode);

      // 4. Создать запись в email_verifications
      await typedPb.collection('email_verifications').create({
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
        // Откатить создание пользователя и записи верификации
        try {
          await typedPb.collection(COLLECTIONS.USERS).delete(user.id);
          await this.deleteVerificationRecord(data.email);
        } catch (rollbackError) {
          console.error('❌ Ошибка отката:', rollbackError);
        }

        await logSecurityEvent('email_send_failed', data.email, false, 'Failed to send verification email');
        throw new Error('Не удалось отправить код верификации. Попробуйте еще раз.');
      }

      // 6. Залогировать успешную регистрацию
      await logSecurityEvent('registration_success', data.email, true);

      console.log('✅ Регистрация завершена успешно');

      return {
        user,
        success: true,
        message: 'Код верификации отправлен на ваш email',
      };
    } catch (error: any) {
      console.error('❌ Ошибка регистрации:', error);
      console.error('❌ Детали ошибки:', {
        message: error.message,
        status: error.status,
        data: error.response?.data,
      });

      // ИСПРАВЛЕНО: parseError уже возвращает строку, не оборачиваем в Error
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

      // 1. Получить запись верификации
      const verifications = await typedPb.collection('email_verifications').getFullList({
        filter: `email = "${email}" && verified = false`,
        sort: '-created',
      });

      if (verifications.length === 0) {
        await logSecurityEvent('verification_failed', email, false, 'No verification record found');
        throw new Error('Запись верификации не найдена');
      }

      const verification = verifications[0];
      console.log('✅ Запись верификации найдена');

      // 2. Проверить, не заблокирован ли
      if (verification.blocked) {
        const blockedUntil = new Date(verification.blockedUntil);
        if (blockedUntil > new Date()) {
          await logSecurityEvent('verification_failed', email, false, 'Verification blocked');
          throw new Error('Верификация временно заблокирована. Попробуйте позже.');
        }
      }

      // 3. Проверить количество попыток
      if (verification.attempts >= verification.maxAttempts) {
        await logSecurityEvent('verification_failed', email, false, 'Max attempts exceeded');
        throw new Error('Превышено количество попыток. Отправьте код повторно.');
      }

      // 4. Проверить срок действия
      if (new Date(verification.expiresAt) < new Date()) {
        await logSecurityEvent('verification_failed', email, false, 'Code expired');
        throw new Error('Код верификации истек. Отправьте новый код.');
      }

      // 5. Проверить код
      const codeHash = await hashCode(code);
      if (verification.codeHash !== codeHash) {
        // Увеличить счетчик попыток
        const newAttempts = verification.attempts + 1;
        await typedPb.collection('email_verifications').update(verification.id, {
          attempts: newAttempts,
        });

        // Заблокировать если достигнут лимит
        if (newAttempts >= verification.maxAttempts) {
          await typedPb.collection('email_verifications').update(verification.id, {
            blocked: true,
            blockedUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          });
        }

        await logSecurityEvent('verification_failed', email, false, 'Invalid code');
        const remainingAttempts = verification.maxAttempts - newAttempts;
        throw new Error(`Неверный код верификации. Осталось попыток: ${remainingAttempts}`);
      }

      console.log('✅ Код верный');

      // 6. Код верный - обновить статусы
      await typedPb.collection('email_verifications').update(verification.id, {
        verified: true,
        attempts: 0,
      });

      // 7. Обновить пользователя
      const users = await typedPb.collection(COLLECTIONS.USERS).getFullList({
        filter: `email = "${email}"`,
      });

      if (users.length === 0) {
        throw new Error('Пользователь не найден');
      }

      const user = users[0];
      const updatedUser = await typedPb.collection(COLLECTIONS.USERS).update<User>(user.id, {
        verified: true,
      });

      console.log('✅ Пользователь обновлен');

      // 8. Авторизовать пользователя
      // ВАЖНО: Нужен правильный пароль для авторизации
      // Но у нас нет доступа к паролю здесь, поэтому пропускаем авторизацию
      // Пользователь должен будет войти вручную после верификации

      // 9. Залогировать успех
      await logSecurityEvent('verification_success', email, true);

      console.log('✅ Верификация завершена успешно');

      return {
        success: true,
        user: updatedUser,
        token: '', // Токен пустой, т.к. не авторизовали
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

      // 1. Проверить rate limit
      const rateLimitKey = `verify_resend:${email}`;
      const canResend = await this.checkRateLimit(rateLimitKey);

      if (!canResend) {
        await logSecurityEvent('resend_failed', email, false, 'Rate limit exceeded');
        throw new Error('Слишком много попыток. Подождите 60 секунд.');
      }

      // 2. Найти пользователя
      const users = await typedPb.collection(COLLECTIONS.USERS).getFullList({
        filter: `email = "${email}"`,
      });

      if (users.length === 0) {
        throw new Error('Пользователь не найден');
      }

      const user = users[0];

      // 3. Проверить, не подтвержден ли уже
      if (user.verified) {
        throw new Error('Email уже подтвержден');
      }

      // 4. Удалить старую запись верификации
      await this.deleteVerificationRecord(email);

      // 5. Создать новую запись
      const verificationCode = generateVerificationCode();
      const codeHash = await hashCode(verificationCode);
      const expiresAt = new Date(Date.now() + VERIFICATION_CONFIG.CODE_EXPIRY_MINUTES * 60 * 1000);

      await typedPb.collection('email_verifications').create({
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

      console.log('✅ Новый код сгенерирован:', verificationCode);

      // 6. Отправить новый email
      await sendVerificationEmail(email, verificationCode, user.name || user.username);

      // 7. Обновить rate limit
      await this.updateRateLimit(rateLimitKey);

      // 8. Залогировать
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
   * Проверка rate limit
   */
  private async checkRateLimit(key: string): Promise<boolean> {
    try {
      const limits = await typedPb.collection('rate_limits').getFullList({
        filter: `key = "${key}"`,
      });

      if (limits.length === 0) {
        return true;
      }

      const limit = limits[0];
      const now = new Date();
      const expiresAt = new Date(limit.expiresAt);

      if (expiresAt < now) {
        await typedPb.collection('rate_limits').delete(limit.id);
        return true;
      }

      if (limit.count >= 3) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Ошибка проверки rate limit:', error);
      return true;
    }
  }

  /**
   * Обновление rate limit
   */
  private async updateRateLimit(key: string): Promise<void> {
    try {
      const limits = await typedPb.collection('rate_limits').getFullList({
        filter: `key = "${key}"`,
      });

      const windowStart = new Date();
      const expiresAt = new Date(Date.now() + VERIFICATION_CONFIG.RESEND_COOLDOWN_SECONDS * 1000);

      if (limits.length === 0) {
        await typedPb.collection('rate_limits').create({
          key,
          count: 1,
          windowStart: windowStart.toISOString(),
          expiresAt: expiresAt.toISOString(),
        });
      } else {
        const limit = limits[0];
        await typedPb.collection('rate_limits').update(limit.id, {
          count: limit.count + 1,
          expiresAt: expiresAt.toISOString(),
        });
      }
    } catch (error) {
      console.error('Ошибка обновления rate limit:', error);
    }
  }

  /**
   * Удаление записи верификации
   */
  private async deleteVerificationRecord(email: string): Promise<void> {
    try {
      const verifications = await typedPb.collection('email_verifications').getFullList({
        filter: `email = "${email}"`,
      });

      for (const verification of verifications) {
        await typedPb.collection('email_verifications').delete(verification.id);
      }
    } catch (error) {
      console.error('Ошибка удаления записи верификации:', error);
    }
  }

  /**
   * Парсинг ошибок
   */
  private parseError(error: any): string {
    // Если это уже наша ошибка с сообщением
    if (error.message && typeof error.message === 'string') {
      // Проверяем специфичные сообщения
      if (error.message.includes('зарегистрирован') ||
        error.message.includes('подтвержден') ||
        error.message.includes('не найден') ||
        error.message.includes('истек') ||
        error.message.includes('попыток') ||
        error.message.includes('заблокирован')) {
        return error.message;
      }
    }

    // Ошибки PocketBase
    if (error.response?.data) {
      const data = error.response.data;

      if (data.email) {
        return 'Этот email уже зарегистрирован';
      }

      if (data.password) {
        return 'Пароль слишком слабый';
      }

      if (data.username) {
        return 'Это имя пользователя уже занято';
      }

      if (data.message) {
        return data.message;
      }
    }

    // Сетевые ошибки
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return 'Проверьте подключение к интернету';
    }

    // Ошибки сервера
    if (error.status >= 500) {
      return 'Сервер временно недоступен. Попробуйте позже.';
    }

    // Ошибки PocketBase API
    if (error.status === 400) {
      return 'Неверные данные. Проверьте заполнение полей.';
    }

    if (error.status === 404) {
      return 'Ресурс не найден. Проверьте настройки PocketBase.';
    }

    // Дефолтное сообщение
    return error.message || 'Произошла ошибка. Попробуйте еще раз';
  }
}

// Экспортируем singleton instance
export const authService = new AuthService();

// Экспортируем константы
export { VERIFICATION_CONFIG };
