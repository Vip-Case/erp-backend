import * as dotenv from "dotenv";

dotenv.config();

export const mongoConfig = {
  url: process.env.MONGO_URI || "mongodb://mongo:27017/drizzle",
};