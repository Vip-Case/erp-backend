FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun install --frozen-lockfile
CMD ["bun", "run", "--watch", "src/index.ts"]