FROM oven/bun:latest

# Çalışma dizini ayarla
WORKDIR /app

# Paket dosyalarını kopyala
COPY package.json bun.lockb ./

# Çevresel değişken dosyasını kopyala
COPY .env .env

# Bağımlılıkları kur
RUN bun install --frozen-lockfile
RUN bun add prisma --global

# Uygulama dosyalarını kopyala
COPY . .

# wait-for-it.sh ve init.sh dosyalarını kopyala
COPY wait-for-it.sh /wait-for-it.sh
COPY init.sh /init.sh

# Çalıştırma izinlerini ayarla
RUN chmod +x /wait-for-it.sh /init.sh

# Uygulamayı başlatma komutu
CMD ["/wait-for-it.sh", "postgres:5432", "--", "/init.sh"]
