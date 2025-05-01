// lib/redis.ts
import Redis from "ioredis";

export const redis = new Redis();

export const rateLimit = async (
  key: string,
  limit: number,
  windowSeconds: number
) => {
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, windowSeconds);

  const success = current <= limit;
  return { success };
};
