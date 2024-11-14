FROM oven/bun
WORKDIR /app
COPY package.json bun.lockb .env ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun install --frozen-lockfile
CMD ["bun", "run", "--watch", "src/index.ts"]