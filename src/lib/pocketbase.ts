/**
 * Конфигурация PocketBase клиента
 * 
 * Singleton instance PocketBase с автоматическим сохранением
 * состояния аутентификации в localStorage.
 */

import PocketBase from 'pocketbase';
import type { User } from '@/types/auth.types';

// Проверка наличия URL PocketBase в переменных окружения
if (!process.env.NEXT_PUBLIC_POCKETBASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_POCKETBASE_URL не настроен в переменных окружения. ' +
    'Добавьте его в файл .env.local'
  );
}

/**
 * Singleton instance PocketBase
 * 
 * Этот экземпляр используется во всем приложении для взаимодействия
 * с PocketBase backend. Автоматически сохраняет auth state в localStorage.
 */
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

// Отключить автоматическую отмену запросов при размонтировании компонентов
pb.autoCancellation(false);

/**
 * Типизированные коллекции PocketBase
 * 
 * Эти типы помогают TypeScript понимать структуру данных
 * при работе с разными коллекциями.
 */
export interface TypedPocketBase extends PocketBase {
  collection(idOrName: 'users'): {
    create<T = User>(body: any): Promise<T>;
    update<T = User>(id: string, body: any): Promise<T>;
    getOne<T = User>(id: string, options?: any): Promise<T>;
    getFullList<T = User>(options?: any): Promise<T[]>;
    authWithPassword<T = User>(email: string, password: string): Promise<{
      token: string;
      record: T;
    }>;
  };
}

/**
 * Типизированный экземпляр PocketBase
 */
export const typedPb = pb as unknown as TypedPocketBase;

/**
 * Проверка, авторизован ли пользователь
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Получить текущего пользователя
 */
export function getCurrentUser(): User | null {
  return pb.authStore.model as User | null;
}

/**
 * Выход из системы
 */
export function logout(): void {
  pb.authStore.clear();
}

/**
 * Обработчик изменения состояния аутентификации
 * 
 * Используйте для отслеживания изменений auth state:
 * 
 * @example
 * ```ts
 * pb.authStore.onChange((token, model) => {
 *   console.log('Auth state changed:', token, model);
 * });
 * ```
 */
export const authStore = pb.authStore;

/**
 * Константы для работы с коллекциями
 */
export const COLLECTIONS = {
  USERS: 'users',
} as const;
