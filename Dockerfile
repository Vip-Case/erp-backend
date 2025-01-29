FROM oven/bun:debian

WORKDIR /app

# Gerekli paketleri yükle
RUN apt-get update && apt-get install -y openssl

# Önce sadece package.json ve lockfile'ı kopyala
COPY package.json bun.lockb ./

# Bağımlılıkları yükle
RUN bun install

# Prisma şemasını kopyala
COPY prisma ./prisma/

COPY . .

# Önce sadece Prisma generate yap
RUN bunx prisma generate


CMD ["bun", "dev"]