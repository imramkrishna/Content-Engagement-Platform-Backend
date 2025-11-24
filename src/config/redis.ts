import { Redis } from "ioredis";
import env from "./env";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  password: env.REDIS_PASSWORD || "",
});

export const setCache = async (key: string, data: any, time?: number) => {
  if (!!time) {
    return await redis.set(key, JSON.stringify(data), "EX", time);
  } else {
    return await redis.set(key, JSON.stringify(data));
  }
};

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
};

export const delCache = async (key: string) => {
  await redis.del(key);
};

export default redis;
