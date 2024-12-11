FROM oven/bun:debian

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

# Prisma Client'ı oluştur
RUN bun prisma generate

# wait-for-it.sh betiğini ekle ve çalıştırılabilir hale getir
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Uygulamayı başlatma komutu
CMD ["/wait-for-it.sh", "postgres:5432", "--", "bun", "run", "--watch", "src/index.ts"]
