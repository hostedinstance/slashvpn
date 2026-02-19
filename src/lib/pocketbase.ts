/**
 * PocketBase клиент для SlashVPN
 */

import PocketBase from 'pocketbase';
import type { User } from '@/types/auth.types';

if (!process.env.NEXT_PUBLIC_POCKETBASE_URL) {
  throw new Error('NEXT_PUBLIC_POCKETBASE_URL не настроен в .env.local');
}

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

export const COLLECTIONS = {
  USERS: 'users',
} as const;

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Получить текущего пользователя.
 * PocketBase SDK v0.21+ переименовал authStore.model → authStore.record.
 * Поддерживаем оба варианта для совместимости.
 */
export function getCurrentUser(): User | null {
  if (!pb.authStore.isValid) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store = pb.authStore as any;
  return (store.record ?? store.model) as User | null;
}

export function logout(): void {
  pb.authStore.clear();
}

export const authStore = pb.authStore;
export const typedPb = pb;
