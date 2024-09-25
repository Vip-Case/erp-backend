import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../data/schema";

const getDatabaseConfig = () => ({
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "drizzle",
});

const createPool = () => new Pool(getDatabaseConfig());

export const db = drizzle(createPool(), { schema });