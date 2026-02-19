'use client';

/**
 * AuthProvider — персистентная сессия по современным стандартам 2026.
 *
 * Стандарты безопасности SPA 2026:
 * ─────────────────────────────────
 * 1. Хранение токена:
 *    PocketBase SDK хранит JWT в localStorage (LocalAuthStore).
 *    Это приемлемо для SPA без SSR — доступен только на этом же origin,
 *    защищён от CSRF автоматически (нет auto-send как у cookies).
 *    Альтернатива (httpOnly cookie) требует сервера — оставляем localStorage.
 *
 * 2. Время жизни токена:
 *    PocketBase выдаёт access token с exp. Его срок — настройка сервера
 *    (обычно 30 дней). Когда он истекает — pb.authStore.isValid = false.
 *
 * 3. Silent refresh (тихое обновление):
 *    При каждом запуске приложения если токен валиден — вызываем authRefresh().
 *    PocketBase возвращает новый токен с обновлённым exp.
 *    Результат: пользователь остаётся залогинен неограниченно долго,
 *    пока регулярно открывает приложение.
 *
 * 4. Если токен истёк полностью (не открывал app дольше срока токена):
 *    authStore.isValid = false → компоненты редиректят на /login.
 *
 * 5. Контекст:
 *    Предоставляет { user, loading, isLoggedIn } всему дереву.
 *    Dashboard и другие защищённые страницы используют этот контекст
 *    вместо прямого pb.authStore — нет лишних перезапросов.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { pb, getCurrentUser, logout as pbLogout } from '@/lib/pocketbase';
import type { User } from '@/types/auth.types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isLoggedIn: false,
  logout: () => {},
  refreshUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    // Шаг 1: читаем токен из localStorage (синхронно)
    if (!pb.authStore.isValid) {
      // Токен отсутствует или истёк — очищаем и показываем как незалогиненного
      pb.authStore.clear();
      setUser(null);
      setLoading(false);
      return;
    }

    // Шаг 2: токен есть — делаем silent refresh чтобы продлить его срок
    try {
      await pb.collection('users').authRefresh();
      // authRefresh() обновляет pb.authStore автоматически — новый токен в localStorage
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } catch {
      // Refresh не удался (сервер недоступен или токен отозван) —
      // оставляем текущего пользователя из localStorage, не разлогиниваем.
      // При следующем запросе к API PocketBase выдаст 401 и тогда уже разлогинимся.
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    // Подписываемся на изменения authStore (например, после authWithPassword)
    // pb.authStore.onChange вызывается при каждом изменении токена
    const unsubscribe = pb.authStore.onChange(() => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, [initAuth]);

  const logout = useCallback(() => {
    pbLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoggedIn: !!user && pb.authStore.isValid,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
