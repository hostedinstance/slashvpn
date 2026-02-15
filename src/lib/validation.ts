/**
 * Схемы валидации для форм аутентификации
 * 
 * Использует Zod для валидации данных форм регистрации и верификации.
 * Все сообщения об ошибках на русском языке.
 */

import { z } from 'zod';

/**
 * Схема валидации формы регистрации
 */
export const registrationSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email обязателен')
      .email('Неверный формат email адреса')
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
      .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
      .regex(
        /[^A-Za-z0-9]/,
        'Пароль должен содержать хотя бы один спецсимвол (!@#$%^&*)'
      ),

    confirmPassword: z.string().min(1, 'Подтвердите пароль'),

    name: z
      .string()
      .min(2, 'Имя должно содержать минимум 2 символа')
      .max(100, 'Имя не должно превышать 100 символов')
      .regex(
        /^[а-яА-ЯёЁa-zA-Z\s]+$/,
        'Имя может содержать только буквы и пробелы'
      )
      .trim(),

    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Необходимо принять условия использования',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

/**
 * Тип данных формы регистрации (выводится из схемы)
 */
export type RegistrationFormData = z.infer<typeof registrationSchema>;

/**
 * Схема валидации формы верификации email
 */
export const verificationSchema = z.object({
  code: z
    .string()
    .length(6, 'Код должен содержать 6 цифр')
    .regex(/^\d+$/, 'Код может содержать только цифры'),
});

/**
 * Тип данных формы верификации
 */
export type VerificationFormData = z.infer<typeof verificationSchema>;

/**
 * Схема валидации email (для проверки доступности)
 */
export const emailSchema = z
  .string()
  .min(1, 'Email обязателен')
  .email('Неверный формат email адреса')
  .toLowerCase()
  .trim();

/**
 * Схема валидации пароля (для отдельной проверки)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Минимум 8 символов')
  .regex(/[A-Z]/, 'Требуется заглавная буква')
  .regex(/[0-9]/, 'Требуется цифра')
  .regex(/[^A-Za-z0-9]/, 'Требуется спецсимвол');
