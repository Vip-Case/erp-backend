FROM oven/bun:debian
WORKDIR /app
COPY package.json bun.lockb ./
COPY .env .env
RUN bun install --frozen-lockfile
COPY . .
RUN bun install --frozen-lockfile
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD ["/wait-for-it.sh", "postgres:5432", "--", "bun", "run", "--watch", "src/index.ts"]