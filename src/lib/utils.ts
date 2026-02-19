/**
 * Утилиты для работы с классами
 * 
 * ВАЖНО: Если в вашем проекте уже есть файл lib/utils.ts
 * с функцией cn(), используйте его! Этот файл можно удалить.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединение и слияние Tailwind классов
 * 
 * Использует clsx для условного объединения классов
 * и tailwind-merge для правильного слияния конфликтующих классов
 * 
 * @example
 * ```tsx
 * cn('px-2 py-1', condition && 'bg-blue-500', 'text-white')
 * // → 'px-2 py-1 bg-blue-500 text-white'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
