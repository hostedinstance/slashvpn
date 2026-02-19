# 🔒 Безопасность в продакшене

## Введение

Этот документ содержит рекомендации по безопасности для развертывания SlashVPN в продакшене в соответствии со стандартами 2026 года.

## 🌐 HTTPS и SSL/TLS

### ✅ Обязательно используйте HTTPS

**Никогда не используйте HTTP в продакшене!**

```nginx
# Пример конфигурации nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Современные SSL настройки
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Редирект с HTTP на HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## 🔑 Переменные окружения

### Безопасное хранение секретов

**❌ Никогда не коммитьте:**
- `.env.local`
- API ключи
- Пароли
- Секретные токены

**✅ Используйте:**

1. **Environment Variables на сервере**
```bash
# Vercel
vercel env add RESEND_API_KEY production

# Railway
railway variables set RESEND_API_KEY=your-key

# Docker
docker run -e RESEND_API_KEY=your-key
```

2. **Secrets Management**
- AWS Secrets Manager
- Google Cloud Secret Manager
- HashiCorp Vault
- Doppler

3. **Минимальные привилегии**
- Используйте разные API ключи для dev/staging/prod
- Ротируйте ключи регулярно
- Ограничьте доступ по IP где возможно

## 🛡️ Защита PocketBase

### 1. Настройка админ панели

```bash
# Заблокируйте доступ к админ панели по IP
# nginx пример:
location /_/ {
    allow 203.0.113.0/24;  # Ваш офисный IP
    deny all;
    proxy_pass http://127.0.0.1:8090;
}
```

### 2. Резервное копирование

```bash
# Автоматический бэкап каждый день
0 2 * * * /usr/bin/backup-pocketbase.sh

#!/bin/bash
# backup-pocketbase.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/pocketbase"
mkdir -p $BACKUP_DIR
cp /app/pocketbase/pb_data/data.db $BACKUP_DIR/data_$DATE.db
# Удалить бэкапы старше 30 дней
find $BACKUP_DIR -name "data_*.db" -mtime +30 -delete
```

### 3. Rate Limiting на уровне сервера

```nginx
# nginx rate limiting
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://127.0.0.1:8090;
        }
    }
}
```

## 🔐 Безопасность аутентификации

### 1. Хеширование паролей

**✅ Реализовано:**
- PocketBase использует bcrypt для хеширования паролей
- Минимальная длина пароля: 8 символов
- Требуется буквы + цифры

**✅ Хеширование кодов верификации:**
```typescript
// Используем base64 для простоты (в продакшене - bcrypt)
async function hashCode(code: string): Promise<string> {
  // В продакшене используйте bcrypt:
  // return bcrypt.hash(code, 10);
  return btoa(code);
}
```

### 2. Защита от брутфорса

**✅ Реализовано:**
- Максимум 5 попыток ввода кода
- Блокировка на 15 минут после превышения лимита
- Rate limiting на отправку кодов (60 секунд между отправками)

**Мониторинг:**
```sql
-- Проверка подозрительной активности
SELECT email, COUNT(*) as failed_attempts
FROM security_logs
WHERE event = 'verification_failed'
AND created >= datetime('now', '-1 hour')
GROUP BY email
HAVING failed_attempts > 10;
```

### 3. Срок действия кодов

**✅ Реализовано:**
- Коды действительны 15 минут
- Автоматическая очистка истекших кодов

**Рекомендация:** Настройте cron для очистки:
```sql
-- Удалить истекшие коды (выполнять каждый час)
DELETE FROM email_verifications
WHERE expiresAt < datetime('now')
AND verified = false;

DELETE FROM login_codes
WHERE expiresAt < datetime('now');
```

## 📧 Безопасность Email

### 1. SPF, DKIM, DMARC

Настройте для вашего домена:

```dns
; SPF Record
yourdomain.com. IN TXT "v=spf1 include:_spf.resend.com ~all"

; DKIM - настраивается в Resend

; DMARC
_dmarc.yourdomain.com. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### 2. Защита от email spoofing

**✅ В коде:**
```typescript
// Всегда валидируйте from email
const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL;
if (!fromEmail.endsWith('@yourdomain.com')) {
  throw new Error('Invalid sender email');
}
```

## 🚫 Content Security Policy (CSP)

```typescript
// next.config.mjs
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
];

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

## 🔍 Мониторинг и логирование

### 1. Security Logs

Мониторьте security_logs в PocketBase:

```javascript
// Скрипт для проверки подозрительной активности
async function checkSecurityLogs() {
  const logs = await pb.collection('security_logs').getList(1, 100, {
    filter: 'success = false',
    sort: '-created',
  });
  
  // Группировка по email
  const failedAttempts = {};
  logs.items.forEach(log => {
    failedAttempts[log.email] = (failedAttempts[log.email] || 0) + 1;
  });
  
  // Алерт если более 10 неудачных попыток
  Object.entries(failedAttempts).forEach(([email, count]) => {
    if (count > 10) {
      console.error(`⚠️ Подозрительная активность: ${email} - ${count} попыток`);
      // Отправить уведомление админу
    }
  });
}
```

### 2. Error Tracking

Используйте:
- Sentry для отслеживания ошибок
- LogRocket для session replay
- Datadog для метрик

```typescript
// Пример интеграции Sentry
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

## 🔒 Дополнительные меры

### 1. IP Whitelisting для админ панели

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Защита админ роутов
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const ip = request.ip || request.headers.get('x-forwarded-for');
    const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];
    
    if (!allowedIPs.includes(ip)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  
  return NextResponse.next();
}
```

### 2. CORS конфигурация

```typescript
// next.config.mjs
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};
```

### 3. Защита от CSRF

```typescript
// Используйте CSRF токены для форм
import { getCsrfToken } from 'next-auth/react';

const csrfToken = await getCsrfToken();
```

## 📋 Чеклист безопасности для продакшена

- [ ] ✅ HTTPS настроен и форсится
- [ ] ✅ SSL сертификат актуален (Let's Encrypt с автообновлением)
- [ ] ✅ HSTS включен
- [ ] ✅ CSP заголовки настроены
- [ ] ✅ Rate limiting на сервере
- [ ] ✅ Firewall настроен
- [ ] ✅ PocketBase админ панель защищена
- [ ] ✅ Регулярные бэкапы настроены
- [ ] ✅ Мониторинг и алерты настроены
- [ ] ✅ Логирование включено
- [ ] ✅ Environment variables в безопасности
- [ ] ✅ SPF, DKIM, DMARC настроены
- [ ] ✅ Зависимости обновлены
- [ ] ✅ Vulnerability scan выполнен
- [ ] ✅ Penetration testing проведен

## 🆘 Инцидент-реагирование

### При компрометации:

1. **Немедленно:**
   - Отключите скомпрометированные ключи API
   - Сбросьте все сессии пользователей
   - Заблокируйте подозрительные IP

2. **Расследование:**
   - Проверьте security_logs
   - Проанализируйте server logs
   - Определите вектор атаки

3. **Восстановление:**
   - Восстановите из последнего безопасного бэкапа
   - Обновите все секреты
   - Уведомите пользователей (если нужно)

4. **Предотвращение:**
   - Закройте уязвимость
   - Обновите процедуры безопасности
   - Проведите постмортем

## 📚 Дополнительные ресурсы

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/controls)
- [Security Headers](https://securityheaders.com)

---

**🔒 Безопасность - это процесс, а не одноразовое действие. Регулярно пересматривайте и обновляйте меры защиты.**
