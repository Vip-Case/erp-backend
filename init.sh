#!/bin/sh

echo "📡 Waiting for PostgreSQL to be ready..."
/wait-for-it.sh postgres:5432 -- echo "✅ PostgreSQL is ready."

echo "📡 Running Prisma Generate..."
# Debug modunu ekleyelim
DEBUG="prisma:*" bunx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma generate failed"
    exit 1
fi

echo "⚙️ Applying Prisma migrations..."
if bunx prisma migrate deploy; then
    echo "✅ Migrations applied successfully."
else
    echo "❌ Migration failed. Exiting..."
    exit 1
fi

echo "🚀 Starting the application..."
exec bun dev