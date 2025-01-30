FROM oven/bun:debian

# Çalışma dizini ayarla
WORKDIR /app

# Paket dosyalarını kopyala
COPY package.json bun.lockb ./

# Çevresel değişken dosyasını kopyala
COPY .env .env

# Bağımlılıkları kur
RUN bun install
RUN bun add prisma --global

# Uygulama dosyalarını kopyala
COPY . .

# Prisma generate
RUN bunx prisma generate

# Uygulamayı başlatma komutu
CMD ["bun", "dev"]
