import Redis from "ioredis";
import logger from "../utils/logger";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_HOST?.includes(".redis.cache.windows.net")
    ? { servername: process.env.REDIS_HOST }
    : undefined,
  connectTimeout: 30000, // 30 saniye
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 5000);
    logger.info(`Redis bağlantısı yeniden deneniyor... Deneme: ${times}`);
    return delay;
  },
  maxRetriesPerRequest: 5,
  enableOfflineQueue: true,
});

redis.on("connect", () => {
  logger.info("Redis bağlantısı başarılı");
});

redis.on("error", (error) => {
  logger.error("Redis bağlantı hatası:", error);
});

export default redis;
