/**
 * Toast Provider компонент
 * 
 * Обертка для react-hot-toast с кастомными стилями
 * для SlashVPN темной темы.
 */

'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Длительность по умолчанию
        duration: 4000,

        // Стили для success тостов
        success: {
          style: {
            background: '#10b981',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10b981',
          },
        },

        // Стили для error тостов
        error: {
          style: {
            background: '#ef4444',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#ef4444',
          },
        },

        // Стили для loading тостов
        loading: {
          style: {
            background: '#6366f1',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
        },

        // Дефолтные стили
        style: {
          background: '#18181b',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    />
  );
}
