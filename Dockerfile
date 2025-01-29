FROM oven/bun:debian

WORKDIR /app

# Prisma'nın ihtiyaç duyduğu OpenSSL'i ekleyelim
RUN apt-get update && apt-get install -y openssl

COPY package.json bun.lockb ./
COPY .env .env

# Prisma'yı global yerine lokal olarak kuralım
RUN bun install
# Bu satırı kaldıralım: RUN bun add prisma --global

# Prisma için gerekli dizini ve izinleri ayarlayalım
RUN mkdir -p /app/node_modules/.prisma
RUN chmod -R 777 /app/node_modules/.prisma

COPY . .
COPY wait-for-it.sh /wait-for-it.sh
COPY init.sh /init.sh

RUN chmod +x /wait-for-it.sh /init.sh

CMD ["/wait-for-it.sh", "postgres:5432", "--", "/init.sh"]