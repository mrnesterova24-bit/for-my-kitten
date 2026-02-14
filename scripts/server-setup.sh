#!/bin/bash
# Один скрипт для настройки сервера: Node, Nginx, клон репо, сборка, PM2
# Домен: for-my-kitten.ru (и www.for-my-kitten.ru)
# Сервер (IP в DNS на reg.ru): 89.111.155.12
# Запуск на сервере: sudo bash setup.sh

set -e
REPO="https://github.com/mrnesterova24-bit/for-my-kitten.git"
DOMAIN="for-my-kitten.ru"
APP_DIR="/var/www/for-my-kitten"

echo "=== 1. Node.js ==="
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node -v

echo "=== 2. Nginx и Certbot ==="
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx

echo "=== 3. Клонирование проекта ==="
sudo mkdir -p /var/www
if [ -d "$APP_DIR/.git" ]; then
  (cd "$APP_DIR" && sudo git pull)
else
  sudo git clone "$REPO" "$APP_DIR"
fi
sudo chown -R "$(whoami)" "$APP_DIR" 2>/dev/null || true

echo "=== 4. Сборка приложения ==="
cd "$APP_DIR"
npm install
npm run build

echo "=== 5. Данные (пустые файлы, если нет) ==="
mkdir -p src/data public/uploads
for f in memes.json secret-room.json letters.json daily-quotes.json reasons.json feelings.json timeline.json future.json crisis.json puns.json surprises.json distance.json final-letter.json; do
  [ -f "src/data/$f" ] || echo "[]" > "src/data/$f"
done

echo "=== 6. PM2 ==="
sudo npm install -g pm2
pm2 delete for-my-kitten 2>/dev/null || true
pm2 start npm --name "for-my-kitten" -- start
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$(whoami)" --hp "$HOME" | tail -1 | bash

echo "=== 7. Nginx ==="
sudo tee /etc/nginx/sites-available/for-my-kitten.ru > /dev/null << 'NGINX'
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
NGINX
sudo ln -sf /etc/nginx/sites-available/for-my-kitten.ru /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "=== Готово. Сайт: http://$DOMAIN ==="
echo "Для HTTPS выполни (когда DNS уже указывает на этот сервер):"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
