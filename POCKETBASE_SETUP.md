# 📊 Подробная инструкция по настройке PocketBase

## Введение

Этот документ содержит пошаговую инструкцию по настройке всех необходимых коллекций в PocketBase для работы системы аутентификации SlashVPN.

## Запуск PocketBase

1. Скачайте PocketBase с [официального сайта](https://pocketbase.io/docs/)
2. Распакуйте архив
3. Запустите: `./pocketbase serve`
4. Откройте админ панель: `http://127.0.0.1:8090/_/`
5. Создайте админ аккаунт

## Создание коллекций

### 1️⃣ Коллекция `users` (системная)

**Эта коллекция создается автоматически PocketBase**

#### Необходимые настройки:

1. Откройте: Collections > users
2. Проверьте что включены базовые поля:
   - email (email, required, unique)
   - username (text, required, unique)
   - name (text)
   - verified (bool)
   - emailVisibility (bool)
   - password (password)

3. **Добавьте дополнительное поле:**

Нажмите "New field" → "Text"
```
Name: registrationIp
Type: Text
Options: Optional
```

#### API Rules:

Оставьте правила по умолчанию для коллекции users.

---

### 2️⃣ Коллекция `email_verifications`

Для хранения кодов верификации email.

#### Создание:

1. Нажмите "New collection"
2. Name: `email_verifications`
3. Type: Base collection

#### Поля:

**1. email**
- Type: Email
- Options: Required
- Min length: не устанавливать
- Max length: не устанавливать
- Only domain: не устанавливать
- Exceptdomain: не устанавливать

**2. codeHash**
- Type: Text
- Options: Required
- Min length: не устанавливать
- Max length: не устанавливать
- Pattern: не устанавливать

**3. attempts**
- Type: Number
- Options: Required
- Min: 0
- Max: не устанавливать

**4. maxAttempts**
- Type: Number
- Options: Required
- Min: 1
- Max: не устанавливать

**5. blocked**
- Type: Bool
- Options: не требуется

**6. blockedUntil**
- Type: Date
- Options: Optional

**7. expiresAt**
- Type: Date
- Options: Required

**8. verified**
- Type: Bool
- Options: не требуется

**9. ipAddress**
- Type: Text
- Options: Optional

**10. userAgent**
- Type: Text
- Options: Optional

#### API Rules:

**List rule:**
```javascript
@request.auth.id != ""
```

**View rule:**
```javascript
@request.auth.id != ""
```

**Create rule:**
```javascript
@request.auth.id = "" || @request.auth.id != ""
```
(Разрешить всем)

**Update rule:**
```javascript
@request.auth.id != ""
```

**Delete rule:**
```javascript
@request.auth.id != ""
```

---

### 3️⃣ Коллекция `login_codes`

Для passwordless входа (коды отправляемые на email).

#### Создание:

1. Нажмите "New collection"
2. Name: `login_codes`
3. Type: Base collection

#### Поля:

**1. email**
- Type: Email
- Options: Required

**2. codeHash**
- Type: Text
- Options: Required

**3. attempts**
- Type: Number
- Options: Required
- Min: 0

**4. maxAttempts**
- Type: Number
- Options: Required
- Min: 1

**5. blocked**
- Type: Bool
- Options: не требуется

**6. expiresAt**
- Type: Date
- Options: Required

**7. used**
- Type: Bool
- Options: не требуется

#### API Rules:

**List rule:**
```javascript
@request.auth.id != ""
```

**View rule:**
```javascript
@request.auth.id != ""
```

**Create rule:**
```javascript
@request.auth.id = "" || @request.auth.id != ""
```

**Update rule:**
```javascript
@request.auth.id = "" || @request.auth.id != ""
```

**Delete rule:**
```javascript
@request.auth.id != ""
```

---

### 4️⃣ Коллекция `security_logs`

Для аудита безопасности всех действий.

#### Создание:

1. Нажмите "New collection"
2. Name: `security_logs`
3. Type: Base collection

#### Поля:

**1. event**
- Type: Text
- Options: Required

**2. email**
- Type: Email
- Options: Required

**3. ipAddress**
- Type: Text
- Options: Optional

**4. userAgent**
- Type: Text
- Options: Optional

**5. success**
- Type: Bool
- Options: Required

**6. reason**
- Type: Text
- Options: Optional

**7. metadata**
- Type: JSON
- Options: Optional

#### API Rules:

**List rule:**
```javascript
@request.auth.id != ""
```

**View rule:**
```javascript
@request.auth.id != ""
```

**Create rule:**
```javascript
@request.auth.id = "" || @request.auth.id != ""
```

**Update rule:**
```javascript
@request.auth.id != ""
```

**Delete rule:**
```javascript
@request.auth.id != ""
```

---

### 5️⃣ Коллекция `rate_limits`

Для ограничения количества запросов (защита от спама).

#### Создание:

1. Нажмите "New collection"
2. Name: `rate_limits`
3. Type: Base collection

#### Поля:

**1. key**
- Type: Text
- Options: Required, Unique
- Создайте UNIQUE индекс на это поле

**2. count**
- Type: Number
- Options: Required
- Min: 0

**3. windowStart**
- Type: Date
- Options: Required

**4. expiresAt**
- Type: Date
- Options: Required

#### API Rules:

**List rule:**
```javascript
@request.auth.id != ""
```

**View rule:**
```javascript
@request.auth.id != ""
```

**Create rule:**
```javascript
@request.auth.id = "" || @request.auth.id != ""
```

**Update rule:**
```javascript
@request.auth.id = "" || @request.auth.id != ""
```

**Delete rule:**
```javascript
@request.auth.id = "" || @request.auth.id != ""
```

---

## Проверка настройки

После создания всех коллекций:

1. Откройте Collections в админ панели
2. Убедитесь что видите:
   - ✅ users (системная)
   - ✅ email_verifications
   - ✅ login_codes
   - ✅ security_logs
   - ✅ rate_limits

3. Проверьте поля каждой коллекции
4. Проверьте API Rules

## Тестирование

Запустите проект и попробуйте зарегистрироваться:

```bash
npm run dev
```

Откройте `http://localhost:3000/register`

Если всё настроено правильно:
- Регистрация создаст записи в `users` и `email_verifications`
- События запишутся в `security_logs`
- Rate limits будут работать при повторной отправке кодов

## Troubleshooting

### Ошибка "Failed to create record"

**Причина:** Не все обязательные поля созданы  
**Решение:** Проверьте что все Required поля добавлены

### Ошибка "Failed to authenticate"

**Причина:** Неправильные API Rules  
**Решение:** Проверьте правила доступа к коллекциям

### Коды не сохраняются

**Причина:** Проблема с полями codeHash или expiresAt  
**Решение:** Убедитесь что поля созданы с правильным типом

## Резервное копирование

PocketBase хранит данные в файле `pb_data/data.db`

Регулярно делайте бэкапы:

```bash
cp pb_data/data.db pb_data/data.db.backup
```

## Полезные команды

```bash
# Запуск PocketBase
./pocketbase serve

# Запуск на другом порту
./pocketbase serve --http="127.0.0.1:9090"

# Миграции
./pocketbase migrate collections
```

## Дополнительно

Для продакшена рекомендуется:

1. Настроить HTTPS
2. Включить rate limiting на уровне сервера
3. Настроить регулярные бэкапы
4. Мониторить security_logs

---

**✅ После выполнения всех шагов ваш PocketBase готов к работе!**
