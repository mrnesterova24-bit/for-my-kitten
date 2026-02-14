# Деплой на хостинг и подключение домена for-my-kitten.ru

Домен: **for-my-kitten.ru** (reg.ru)  
Сервер: **31.31.197.5**

---

## 1. Настройка DNS в reg.ru

1. Зайди в [reg.ru](https://www.reg.ru) → «Мои домены» → **for-my-kitten.ru** → «Управление» / «Зона DNS».
2. Добавь или измени записи:

   | Тип | Имя (поддомен) | Значение        | TTL  |
   |-----|----------------|-----------------|------|
   | A   | @              | 31.31.197.5     | 3600 |
   | A   | www            | 31.31.197.5     | 3600 |

   Если запись @ уже есть (например, на другой хостинг) — замени значение на **31.31.197.5**.

3. Сохрани изменения. Распространение DNS — от нескольких минут до 24–48 часов. Проверка: `ping for-my-kitten.ru` — должен отвечать 31.31.197.5.

---

## 2. Подготовка сервера (31.31.197.5)

Подключайся по SSH (логин/пароль или ключ от хостинга):

```bash
ssh root@31.31.197.5
```

### Установка Node.js (если ещё нет)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # должно быть v18 или v20
```

### Установка Nginx и Certbot (для HTTPS)

```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

---

## 3. Загрузка проекта на сервер

**Вариант А — через Git (если проект в репозитории)**

На сервере:

```bash
cd /var/www
sudo git clone https://github.com/ТВОЙ_ЛОГИН/ТВОЙ_РЕПО.git for-my-kitten
cd for-my-kitten
```

**Вариант Б — через архив**

На своём компьютере (в папке проекта, без `node_modules` и `.next`):

```bash
# Windows (PowerShell)
npm run build
Compress-Archive -Path * -DestinationPath ../for-my-kitten.zip
# Загрузи for-my-kitten.zip на сервер (SFTP, FileZilla, WinSCP) в /var/www/
```

На сервере:

```bash
cd /var/www
sudo unzip for-my-kitten.zip -d for-my-kitten
cd for-my-kitten
```

### Установка зависимостей и сборка на сервере

```bash
cd /var/www/for-my-kitten
npm install --production
npm run build
```

Папки с данными (если есть на локальной машине): скопируй на сервер в тот же путь:

- `src/data/` (все .json — приложение читает данные отсюда)
- `public/uploads/` (загруженные фото)

Если папки нет, при первом запуске приложение создаст `src/data` и будет читать пустые массивы. Чтобы не было ошибок, можно заранее создать файлы:

```bash
mkdir -p src/data public/uploads
cd src/data
echo "[]" > memes.json
echo "[]" > secret-room.json
echo "[]" > letters.json
echo "[]" > daily-quotes.json
echo "[]" > reasons.json
echo "[]" > feelings.json
echo "[]" > timeline.json
echo "[]" > future.json
echo "[]" > crisis.json
echo "[]" > puns.json
echo "[]" > surprises.json
echo "[]" > distance.json
echo "[]" > final-letter.json
# final-letter.json для одного письма — при необходимости скопируй с локального проекта
```

---

## 4. Запуск приложения

**Простой запуск (для проверки):**

```bash
cd /var/www/for-my-kitten
npm start
```

Приложение слушает порт **3000**. Открой в браузере: `http://31.31.197.5:3000`.

**Постоянный запуск через PM2 (рекомендуется):**

```bash
sudo npm install -g pm2
cd /var/www/for-my-kitten
pm2 start npm --name "for-my-kitten" -- start
pm2 save
pm2 startup   # выполни команду, которую выведет pm2 (для автозапуска после перезагрузки)
```

---

## 5. Nginx как обратный прокси и HTTPS

Создай конфиг Nginx:

```bash
sudo nano /etc/nginx/sites-available/for-my-kitten.ru
```

Вставь (подставь свой домен):

```nginx
server {
    listen 80;
    server_name for-my-kitten.ru www.for-my-kitten.ru;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Включи сайт и перезапусти Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/for-my-kitten.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Проверь: в браузере открой **http://for-my-kitten.ru** — должна открыться твоя Next.js-страница.

### SSL (HTTPS) через Let's Encrypt

Когда домен уже открывается по HTTP:

```bash
sudo certbot --nginx -d for-my-kitten.ru -d www.for-my-kitten.ru
```

Следуй подсказкам (email, согласие с условиями). Certbot сам настроит HTTPS в Nginx. Проверка: **https://for-my-kitten.ru**.

---

## 6. Краткий чек-лист

- [ ] В reg.ru: A-записи @ и www → 31.31.197.5
- [ ] На сервере: Node.js, Nginx, (опционально) PM2
- [ ] Проект в `/var/www/for-my-kitten`, `npm install`, `npm run build`
- [ ] Данные: папки `data/` и `public/uploads/` на месте
- [ ] Приложение запущено: `npm start` или `pm2 start`
- [ ] Nginx проксирует порт 3000, сайт открывается по http://for-my-kitten.ru
- [ ] Certbot: HTTPS включён, https://for-my-kitten.ru работает

---

## Автодеплой при пуше в Git

Можно настроить так: ты делаешь коммиты и пушишь в репозиторий (GitHub/GitLab) с компьютера — сервер сам подтягивает изменения и перезапускает приложение.

### Как это устроено

1. Код хранится в Git (GitHub, GitLab и т.п.).
2. На сервере проект клонирован из этого репозитория и запущен через PM2.
3. В репозитории настроен **webhook**: при пуше в ветку (например `main`) хостинг отправляет POST на твой сайт.
4. В приложении есть маршрут **`/api/deploy`**: он проверяет секретный ключ и в фоне запускает на сервере: `git pull` → `npm install` → `npm run build` → `pm2 restart`.

Ты работаешь как обычно: правки в Cursor → коммит → **push** в Git. Деплой на сервер происходит автоматически.

### Шаг 1. Репозиторий на GitHub

- Создай репозиторий на [github.com](https://github.com).
- В папке проекта на компьютере:

```bash
git remote add origin https://github.com/ТВОЙ_ЛОГИН/ИМЯ_РЕПО.git
git push -u origin main
```

Дальше все коммиты отправляй туда: `git push`.

### Шаг 2. На сервере: переменные окружения

- Проект на сервере должен быть клонирован из Git (не архив) и запущен через PM2.
- Придумай длинный секрет (пароль для webhook): например `openssl rand -hex 24`.
- Задай переменные там, откуда запускается приложение (или в конфиге PM2):

```bash
export DEPLOY_SECRET="твой_секрет"
# если имя в PM2 не for-my-kitten:
export DEPLOY_PM2_NAME="твоё_имя"
```

Перезапусти приложение (или добавь переменные в `ecosystem.config.js` / скрипт запуска PM2).

### Шаг 3. Webhook в GitHub

1. Репозиторий на GitHub → **Settings** → **Webhooks** → **Add webhook**.
2. **Payload URL:** `https://for-my-kitten.ru/api/deploy`
3. **Content type:** `application/json`
4. **Secret:** вставь тот же `DEPLOY_SECRET`, что на сервере (так GitHub подпишет запрос, и мы его проверим).
5. **Which events:** **Just the push event**.
6. Сохрани.

При каждом **push** в репозиторий GitHub отправит POST на этот URL; сервер проверит подпись и запустит деплой в фоне.

### Ручной деплой

Можно вызвать деплой вручную, передав секрет в заголовке или в URL:

```bash
curl -X POST -H "X-Deploy-Secret: твой_секрет" https://for-my-kitten.ru/api/deploy
# или (секрет в URL виден в логах — лучше заголовок)
curl -X POST "https://for-my-kitten.ru/api/deploy?secret=твой_секрет"
```

---

## Важно

- **Пароли и доступ:** логин/пароль админки хранятся в коде (`src/lib/auth.ts`). На проде лучше сменить пароль и не выкладывать репозиторий с паролями в открытый доступ.
- **Бэкапы:** периодически копируй с сервера папки `src/data/` и `public/uploads/` — там весь контент приложения.
- **Обновление:** после изменений в коде на сервере: `git pull` (или заново загрузи файлы), затем `npm install`, `npm run build`, `pm2 restart for-my-kitten`.

---

## Фото и данные на проде (почему не отображаются фото)

После `git pull` папки `src/data/` и `public/uploads/` подменяются версией из репозитория. В репо нет загрузок (`public/uploads` в .gitignore), а JSON из репо может быть пустым — поэтому список фото и сами файлы на проде «пропадают».

**Что сделать один раз на сервере:**

1. **Данные (JSON) вне репо** — чтобы `git pull` их не затирал:
   ```bash
   mkdir -p /var/www/for-my-kitten-data
   cp -r /var/www/for-my-kitten/src/data/* /var/www/for-my-kitten-data/ 2>/dev/null || true
   ```
   В панели reg.ru или в systemd/PM2 задай переменную окружения для приложения:
   ```bash
   export DATA_DIR=/var/www/for-my-kitten-data
   ```
   Перезапусти приложение (`pm2 restart for-my-kitten`). Дальше все JSON (в т.ч. секретная комната) будут читаться и сохраняться в `/var/www/for-my-kitten-data/`.

2. **Загрузки (фото) вне репо** — чтобы папка с фото не затиралась при `git pull`:
   ```bash
   mkdir -p /var/www/for-my-kitten-data/uploads
   cp -r /var/www/for-my-kitten/public/uploads/. /var/www/for-my-kitten-data/uploads/ 2>/dev/null || true
   rm -rf /var/www/for-my-kitten/public/uploads
   ln -s /var/www/for-my-kitten-data/uploads /var/www/for-my-kitten/public/uploads
   ```
   После этого загрузки через сайт попадают в `/var/www/for-my-kitten-data/uploads/`, а раздача по адресу `/uploads/...` по‑прежнему идёт из `public/uploads` (симлинк).

После этих шагов загруженные на проде фото и данные перестанут пропадать при деплое.
