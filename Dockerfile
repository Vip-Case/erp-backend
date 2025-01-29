FROM oven/bun:debian

WORKDIR /app

# Gerekli paketleri yükle
RUN apt-get update && apt-get install -y openssl

# Önce sadece package.json ve lockfile'ı kopyala
COPY package.json bun.lockb ./

# Prisma dizinini oluştur
RUN mkdir -p /app/node_modules/.prisma
RUN chmod -R 777 /app/node_modules/.prisma

# Bağımlılıkları yükle
RUN bun install

# Prisma şemasını kopyala
COPY prisma ./prisma/

# Önce sadece Prisma generate yap
RUN bunx prisma generate

# Geri kalan dosyaları kopyala
COPY . .
COPY wait-for-it.sh /wait-for-it.sh
COPY init.sh /init.sh

RUN chmod +x /wait-for-it.sh /init.sh

CMD ["/wait-for-it.sh", "postgres:5432", "--", "/init.sh"]