/**
 * Email сервис для отправки писем через Resend API
 * 
 * Этот сервис отвечает за отправку email верификационных кодов
 * и других транзакционных писем пользователям.
 */

import { Resend } from 'resend';

// Проверка наличия API ключа
if (!process.env.RESEND_API_KEY) {
  console.warn(
    '⚠️ RESEND_API_KEY не настроен. Email отправка будет симулирована в консоль.'
  );
}

/**
 * Инициализация Resend клиента
 */
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Константы для email
 */
const EMAIL_CONFIG = {
  FROM_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'SlashVPN',
  FROM_EMAIL: process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@slashvpn.com',
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@slashvpn.com',
};

/**
 * Отправка email с кодом верификации
 * 
 * @param to - Email адрес получателя
 * @param code - 6-значный код верификации
 * @param name - Имя пользователя
 * @throws Error если отправка не удалась
 */
export async function sendVerificationEmail(
  to: string,
  code: string,
  name: string
): Promise<void> {
  const html = generateVerificationEmailHTML(code, name);
  const subject = 'Подтвердите ваш email в SlashVPN';

  try {
    // Если API ключ не настроен, симулируем отправку
    if (!resend) {
      console.log('📧 [EMAIL SIMULATION] Отправка письма:');
      console.log(`   Кому: ${to}`);
      console.log(`   Тема: ${subject}`);
      console.log(`   Код верификации: ${code}`);
      console.log(`   HTML длина: ${html.length} символов`);
      return;
    }

    // Реальная отправка через Resend
    const { error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Ошибка отправки email:', error);
      throw new Error(`Не удалось отправить email: ${error.message}`);
    }

    console.log(`✅ Email успешно отправлен на ${to}`);
  } catch (error: any) {
    console.error('Критическая ошибка отправки email:', error);
    throw new Error('Не удалось отправить код верификации. Попробуйте позже.');
  }
}

/**
 * Генерация HTML шаблона для email верификации
 * 
 * @param code - 6-значный код
 * @param name - Имя пользователя
 * @returns HTML строка
 */
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
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #000000;
      font-size: 28px;
      margin: 0;
      font-weight: 700;
    }
    .logo span {
      color: #6366f1;
    }
    .content {
      text-align: center;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .code-container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
    }
    .code {
      font-size: 42px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      user-select: all;
    }
    .expiry {
      color: #666;
      font-size: 14px;
      margin-top: 20px;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin-top: 30px;
      border-radius: 4px;
      text-align: left;
      font-size: 14px;
      color: #856404;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 12px;
      color: #999;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1><span>Slash</span>VPN</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Привет, <strong>${name}</strong>! 👋</p>
      <p>Спасибо за регистрацию в SlashVPN. Для завершения регистрации, пожалуйста, используйте код ниже:</p>
      
      <div class="code-container">
        <div class="code">${code}</div>
      </div>
      
      <p class="expiry">⏱️ Код действителен в течение <strong>15 минут</strong></p>
      
      <div class="warning">
        <strong>⚠️ Важно:</strong> Если вы не регистрировались на SlashVPN, просто проигнорируйте это письмо. Ваша учетная запись в безопасности.
      </div>
    </div>
    
    <div class="footer">
      <p>Нужна помощь? <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">Свяжитесь с нами</a></p>
      <p>&copy; ${currentYear} ${EMAIL_CONFIG.FROM_NAME}. Все права защищены.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Отправка welcome email после успешной регистрации
 * 
 * @param to - Email адрес
 * @param name - Имя пользователя
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Добро пожаловать!</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6366f1;">Добро пожаловать в ${EMAIL_CONFIG.FROM_NAME}!</h1>
      <p>Привет, ${name}!</p>
      <p>Ваш аккаунт успешно создан и подтвержден. Теперь вы можете пользоваться всеми возможностями SlashVPN.</p>
      <p>Если у вас есть вопросы, напишите нам: <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">${EMAIL_CONFIG.SUPPORT_EMAIL}</a></p>
      <p>С уважением,<br>Команда ${EMAIL_CONFIG.FROM_NAME}</p>
    </body>
    </html>
  `;

  try {
    if (!resend) {
      console.log(`📧 [EMAIL SIMULATION] Welcome email для ${to}`);
      return;
    }

    await resend.emails.send({
      from: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: [to],
      subject: `Добро пожаловать в ${EMAIL_CONFIG.FROM_NAME}!`,
      html,
    });

    console.log(`✅ Welcome email отправлен на ${to}`);
  } catch (error) {
    // Welcome email не критичен, просто логируем ошибку
    console.error('Не удалось отправить welcome email:', error);
  }
}
