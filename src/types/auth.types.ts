/**
 * Типы для системы аутентификации SlashVPN
 */

// ==================== ПОЛЬЗОВАТЕЛЬ ====================

/**
 * Модель пользователя из PocketBase (auth коллекция)
 * Поля соответствуют реальной схеме в PocketBase
 */
export interface User {
  id: string;
  email: string;
  name: string;
  /** Имя пользователя (username в PocketBase) */
  username: string;
  /** Подтверждён ли email (поле verified в PocketBase) */
  verified: boolean;
  /** Видимость email */
  emailVisibility: boolean;
  /** IP при регистрации */
  registrationIp?: string;
  created: string;
  updated: string;
  avatar?: string;
}

// ==================== ФОРМЫ ====================

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

// ==================== ОТВЕТЫ ====================

export interface RegistrationResponse {
  user: User;
  success: boolean;
  message?: string;
}

export interface VerificationResponse {
  success: boolean;
  user: User;
  token?: string;
}

export interface ResendCodeResponse {
  success: boolean;
  message: string;
  expiresAt?: string;
}
