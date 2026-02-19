/**
 * Email сервис — клиентская обёртка
 * Вызывает серверный API Route /api/send-email
 * (process.env.RESEND_API_KEY недоступен в браузере, только на сервере)
 */

export async function sendVerificationEmail(
  to: string,
  code: string,
  name: string
): Promise<void> {
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, code, name }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Не удалось отправить код верификации');
  }
}

// Заглушка для совместимости (welcome email не критичен)
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  // TODO: добавить /api/send-welcome при необходимости
  console.log(`[Welcome email] ${to} (${name})`);
}
