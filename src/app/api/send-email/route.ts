/**
 * API Route для отправки email через Resend
 * Запускается на СЕРВЕРЕ — process.env.RESEND_API_KEY доступен
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_CONFIG = {
  FROM_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'SlashVPN',
  FROM_EMAIL: process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@slashvpn.online',
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@slashvpn.online',
};

function generateVerificationEmailHTML(code: string, name: string): string {
  const currentYear = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Подтверждение Email</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
    .container { background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo h1 { color: #000; font-size: 28px; margin: 0; font-weight: 700; }
    .logo span { color: #6366f1; }
    .content { text-align: center; }
    .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
    .code-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin: 30px 0; }
    .code { font-size: 42px; font-weight: bold; letter-spacing: 8px; color: #fff; font-family: 'Courier New', monospace; }
    .expiry { color: #666; font-size: 14px; margin-top: 20px; }
    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 30px; border-radius: 4px; text-align: left; font-size: 14px; color: #856404; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; }
    .footer a { color: #6366f1; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"><h1><span>Slash</span>VPN</h1></div>
    <div class="content">
      <p class="greeting">Привет, <strong>${name}</strong>! 👋</p>
      <p>Для завершения регистрации введите код ниже:</p>
      <div class="code-container"><div class="code">${code}</div></div>
      <p class="expiry">⏱️ Код действителен <strong>15 минут</strong></p>
      <div class="warning"><strong>⚠️ Важно:</strong> Если вы не регистрировались — просто проигнорируйте письмо.</div>
    </div>
    <div class="footer">
      <p>Нужна помощь? <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">Свяжитесь с нами</a></p>
      <p>&copy; ${currentYear} ${EMAIL_CONFIG.FROM_NAME}. Все права защищены.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { to, code, name } = await req.json();

    if (!to || !code || !name) {
      return NextResponse.json({ error: 'Отсутствуют обязательные поля: to, code, name' }, { status: 400 });
    }

    if (!resend) {
      // dev-режим: логируем в консоль сервера
      console.log('📧 [EMAIL SIMULATION - SERVER]');
      console.log(`   Кому: ${to}`);
      console.log(`   Код: ${code}`);
      return NextResponse.json({ success: true, simulated: true });
    }

    const { error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: [to],
      subject: 'Подтвердите ваш email в SlashVPN',
      html: generateVerificationEmailHTML(code, name),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /send-email error:', err);
    return NextResponse.json({ error: err.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
