#!/bin/sh

echo "📡 Waiting for PostgreSQL to be ready..."
/wait-for-it.sh postgres:5432 -- echo "✅ PostgreSQL is ready."

echo "📡 Waiting for Prisma to be ready..."
bunx prisma generate || exit 1

echo "⚙️ Running Prisma migrations..."
bunx prisma migrate dev --name init || exit 1

echo "🧹 Destroying old data..."
bun destroy || exit 1

echo "🌱 Seeding database..."
bun seed || exit 1

echo "🚀 Starting the application..."
exec bun dev
