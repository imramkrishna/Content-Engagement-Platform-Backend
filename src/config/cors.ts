import { cors } from "@elysiajs/cors";
export const allowOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8081",
  "http://localhost:8082",
  "https://gistfeed.com",
  "http://gistfeed.com",
];
const corsOptions = cors({
  origin: allowOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Api-Key",
    "Accept",
    "Accept-Language",
  ],
  credentials: true,
});

export default corsOptions;
