FROM ubuntu:22.04

# Temel paketleri yükle ve zaman dilimini ayarla
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    ca-certificates \
    unzip \
    git \
    tzdata \
    && ln -fs /usr/share/zoneinfo/Europe/Istanbul /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

# Node.js kurulumu
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Bun kurulumu
RUN curl -fsSL https://bun.sh/install | bash \
    && ln -s /root/.bun/bin/bun /usr/local/bin/bun \
    && ln -s /root/.bun/bin/bunx /usr/local/bin/bunx

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılık dosyalarını kopyala
COPY package.json bun.lockb ./

# Bağımlılıkları yükle
RUN bun install --frozen-lockfile

# Kaynak kodları kopyala
COPY . .

# Prisma client'ı NPX ile oluştur
RUN npx prisma generate

# Uygulama portunu belirt
EXPOSE 1303

# Timeout süresini artır
ENV NODE_OPTIONS="--max-http-header-size=16384 --http-parser=legacy --max-http-request-timeout=300000"

# Uygulamayı başlat
CMD ["bun", "start"]