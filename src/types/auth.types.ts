/**
 * Типы для системы аутентификации SlashVPN
 * 
 * Этот файл содержит все TypeScript типы и интерфейсы,
 * используемые в системе регистрации и верификации email.
 */

// ==================== ПОЛЬЗОВАТЕЛЬ ====================

/**
 * Модель пользователя из PocketBase
 */
export interface User {
  /** Уникальный идентификатор пользователя */
  id: string;
  /** Email адрес */
  email: string;
  /** Полное имя пользователя */
  name: string;
  /** Подтвержден ли email адрес */
  emailVerified: boolean;
  /** Код верификации email (6 цифр) */
  verificationCode?: string;
  /** Время истечения кода верификации */
  verificationCodeExpiry?: string;
  /** Количество неудачных попыток верификации */
  verificationAttempts?: number;
  /** Дата создания записи */
  created: string;
  /** Дата последнего обновления */
  updated: string;
  /** Аватар пользователя (опционально) */
  avatar?: string;
}

// ==================== ФОРМЫ ====================

/**
 * Данные формы регистрации
 */
export interface RegistrationFormData {
  /** Email адрес */
  email: string;
  /** Пароль (минимум 8 символов, 1 заглавная, 1 цифра, 1 спецсимвол) */
  password: string;
  /** Подтверждение пароля */
  confirmPassword: string;
  /** Полное имя пользователя */
  name: string;
  /** Согласие с условиями использования */
  acceptTerms: boolean;
}

/**
 * Данные для создания пользователя (отправка на backend)
 */
export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

/**
 * Данные формы верификации email
 */
export interface VerificationFormData {
  /** 6-значный код верификации */
  code: string;
}

// ==================== ОТВЕТЫ API ====================

/**
 * Ответ при успешной регистрации
 */
export interface RegistrationResponse {
  /** Созданный пользователь */
  user: User;
  /** Флаг успешности операции */
  success: boolean;
  /** Сообщение (опционально) */
  message?: string;
}

/**
 * Ответ при успешной верификации
 */
export interface VerificationResponse {
  /** Флаг успешности операции */
  success: boolean;
  /** Обновленный пользователь */
  user: User;
  /** Auth token */
  token?: string;
}

/**
 * Ответ при повторной отправке кода
 */
export interface ResendCodeResponse {
  /** Флаг успешности операции */
  success: boolean;
  /** Сообщение */
  message: string;
  /** Новое время истечения */
  expiresAt?: string;
}

/**
 * Общий формат ошибки API
 */
export interface ApiError {
  /** Код ошибки */
  code: string;
  /** Сообщение об ошибке */
  message: string;
  /** Детали ошибки (опционально) */
  details?: Record<string, string[]>;
}

// ==================== УТИЛИТЫ ====================

/**
 * Требования к паролю для отображения в UI
 */
export interface PasswordRequirement {
  /** Текст требования */
  label: string;
  /** Выполнено ли требование */
  met: boolean;
  /** Регулярное выражение для проверки */
  regex?: RegExp;
}

/**
 * Состояние таймера верификации
 */
export interface TimerState {
  /** Оставшееся время в секундах */
  timeLeft: number;
  /** Запущен ли таймер */
  isRunning: boolean;
  /** Истек ли таймер */
  isExpired: boolean;
}

/**
 * Rate limiting состояние
 */
export interface RateLimitState {
  /** Количество попыток */
  attempts: number;
  /** Максимум попыток */
  maxAttempts: number;
  /** Время последней попытки */
  lastAttempt?: number;
  /** Можно ли сделать попытку */
  canAttempt: boolean;
  /** Время до следующей попытки (секунды) */
  timeUntilNext?: number;
}

// ==================== НАСТРОЙКИ ====================

/**
 * Конфигурация системы верификации
 */
export interface VerificationConfig {
  /** Длина кода верификации */
  codeLength: number;
  /** Время жизни кода (минуты) */
  codeExpiryMinutes: number;
  /** Максимум попыток ввода кода */
  maxVerificationAttempts: number;
  /** Минимальное время между отправками (секунды) */
  resendCooldownSeconds: number;
  /** Максимум отправок за период */
  maxResendAttempts: number;
  /** Период для отслеживания отправок (минуты) */
  resendPeriodMinutes: number;
}

/**
 * Конфигурация валидации пароля
 */
export interface PasswordValidationConfig {
  /** Минимальная длина */
  minLength: number;
  /** Требуется ли заглавная буква */
  requireUppercase: boolean;
  /** Требуется ли цифра */
  requireNumber: boolean;
  /** Требуется ли спецсимвол */
  requireSpecialChar: boolean;
  /** Спецсимволы */
  specialChars: string;
}
