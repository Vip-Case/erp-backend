import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/data/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    port: parseInt(process.env.DB_PORT || "5432"),
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "erp_db",
    ssl: false,
  },
  verbose: true,
  strict: true,
});
