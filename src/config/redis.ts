import Redis from "ioredis";
import logger from "../utils/logger";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("error", (error) => {
  logger.error("Redis bağlantı hatası:", error);
});

redis.on("connect", () => {
  logger.info("Redis bağlantısı başarılı");
});

export default redis;
