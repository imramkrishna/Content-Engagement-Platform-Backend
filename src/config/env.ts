import dotenv from "dotenv";
dotenv.config();

const env: any = {
  APP_NAME: process.env.APP_NAME,
  PORT: process.env.PORT || 9000,
  BUCKET_PORT: process.env.BUCKET_PORT || 9002,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  RESPONSE_SECRET: process.env.RESPONSE_SECRET,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  REDIS_TTL: 3600,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASS,
  MAIL_SERVICE: process.env.MAIL_SERVICE,
};

export default env;
