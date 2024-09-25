import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    port: parseInt(process.env.DB_PORT || "5432"),
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "drizzle",
  },
});
