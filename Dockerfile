FROM oven/bun:debian as builder

WORKDIR /app

# Sadece package.json ve prisma dosyalarını kopyala
COPY package.json bun.lockb ./
COPY prisma ./prisma/

# Bağımlılıkları yükle
RUN bun install
RUN bun add prisma --global

# Prisma client'ı oluştur
RUN bunx prisma generate

FROM oven/bun:debian

WORKDIR /app

# Builder aşamasından gerekli dosyaları kopyala
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Geri kalan dosyaları kopyala
COPY . .

CMD ["bun", "dev"]