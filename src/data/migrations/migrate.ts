import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const db = drizzle(pool);

async function main() {
    console.log('Migration started');
    await migrate(db, { migrationsFolder: './drizzle' });
    await pool.end();
    console.log('Migration completed');
}

main().catch((err) => {
    console.error('Migration failed', err);
    process.exit(1);
});