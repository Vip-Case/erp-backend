#!/bin/sh

echo "📡 Waiting for PostgreSQL to be ready..."
/wait-for-it.sh postgres:5432 -- echo "✅ PostgreSQL is ready."

echo "📡 Waiting for Prisma to be ready..."
bunx prisma generate || exit 1

echo "⚙️ Applying Prisma migrations..."
if bunx prisma migrate deploy; then
  bunx prisma generate
  echo "✅ Migrations applied successfully."
else
  echo "❌ Migration failed. Exiting..."
  exit 1
fi

echo "🚀 Starting the application..."
exec bun dev
