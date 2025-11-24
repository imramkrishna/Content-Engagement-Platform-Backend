# Content/Engagement Platform  Backend

Backend service for Content/Engagement Platform Feed built with Bun and Elysia. It exposes a modular REST API for content, engagement, notifications, rewards, and admin operations while handling uploads, scheduled jobs, and push/email delivery.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Database & Seeding](#database--seeding)
- [Available Scripts](#available-scripts)
- [Running with Docker](#running-with-docker)
- [API Access & Security](#api-access--security)
- [Domain Modules](#domain-modules)
- [Background Jobs & Storage](#background-jobs--storage)
- [Testing & Linting](#testing--linting)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Overview
- Bun + Elysia service that powers the administrative and consumer-facing surfaces of Content/Engagement Platform Feed.
- Sequelize-backed MySQL data models with scripted migrations and seeders.
- Redis caching plus push/email notification pipelines.
- Dedicated Express bucket server to serve uploaded media from the `uploads/` directory.
- Centralized validation, helpers, and middleware for API key and JWT enforcement.

## Architecture
| Component | Description |
| --- | --- |
| `src/index.ts` | Boots the API server, initializes routes, authenticates the DB, and starts scheduled jobs. |
| `src/config/server.ts` | Configures the Elysia server with CORS, Helmet, guest cookie issuance, API key middleware, and global error handling. |
| `src/bucket.ts` | Lightweight Express server that serves `/uploads/**` for public asset delivery on `BUCKET_PORT`. |
| `src/routes/*.ts` | Route definitions assembled in `src/routes/index.ts`, each mapping to module controllers with optional auth guards. |
| `src/modules/**` | Feature-specific domain logic (models, validation, services, migrations). |
| `src/config/*` | Infrastructure wiring (DB connection, Redis client, mailer, Firebase push, schedules, env loader, etc.). |
| `src/utils/*` | Reusable helpers for token handling, validation schemas, uploads, and messaging. |

## Tech Stack
- **Runtime:** [Bun](https://bun.sh) 1.x
- **Framework:** [Elysia](https://elysiajs.com/) with Express for the bucket server
- **Database:** MySQL (via Sequelize)
- **Caching & Queues:** Redis (ioredis)
- **Messaging:** Nodemailer (SMTP) + Firebase Admin for push notifications
- **Media:** Sharp, fluent-ffmpeg, heic-convert for image/video manipulation
- **Scheduling:** node-schedule driven tasks (see `src/config/schedule.ts`)

## Prerequisites
Before running locally ensure the following are installed:
- [Bun](https://bun.sh/) `>=1.1`
- MySQL 8 (or compatible) instance with credentials that match your `.env`
- Redis `>=6.x`
- `libvips` and `ffmpeg` binaries for Sharp / fluent-ffmpeg processing
- Firebase service account JSON for push notifications placed at `src/config/pushNotification.json`

## Local Setup
```bash
git clone https://github.com/inflancer/Content/Engagement Platform-backend.git
cd Content/Engagement Platform-backend
cp env.example .env            # update secrets and service endpoints
bun install                    # install dependencies

# Run the API & bucket in watch mode
bun run dev
```

The development server listens on `PORT` (default `9000`) for API traffic and `BUCKET_PORT` (default `9002`) for uploads. All REST endpoints are namespaced under `/api/*`.

## Environment Variables
| Variable | Description | Default |
| --- | --- | --- |
| `APP_NAME` | Service label surfaced in logs | - |
| `PORT` | API port for the Elysia server | `9000` |
| `BUCKET_PORT` | Static bucket server port | `9002` |
| `DB_NAME`/`DB_USER`/`DB_PASS`/`DB_HOST` | MySQL connection settings used by Sequelize | - |
| `API_KEY` | Required `Api-Key` header enforced by `checkApiKey` | - |
| `JWT_SECRET` | Secret used for signing access tokens | - |
| `RESPONSE_SECRET` | Additional signing secret used across responses/utilities | - |
| `MODE` | Optional runtime mode flag (`test`, `production`, etc.) | `test` |
| `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD` | Redis connection | `localhost` / `6379` / empty |
| `MAIL_HOST`/`MAIL_PORT`/`MAIL_USER`/`MAIL_PASS`/`MAIL_SERVICE` | SMTP credentials consumed by Nodemailer | - |

> **Firebase push:** store the Firebase service account JSON as `src/config/pushNotification.json`. It is loaded during startup by `src/config/firebase.ts`.

## Database & Seeding
The project manages schema through TypeScript migrations referenced in `src/migrations/path.ts`.

```bash
# Run all migrations (executes files listed in src/migrations/path.ts)
bun run migrate

# Seed the default admin user (email: admin@gmail.com, username: admin)
bun run seed
```

Ensure the DB defined in `.env` exists before running migrations. The seed inserts a single admin record with a pre-hashed password; update or remove it for production.

## Available Scripts
| Script | Description |
| --- | --- |
| `bun run dev` | Run API and bucket servers in watch mode. |
| `bun run build` | Bundle `src/index.ts` and `src/bucket.ts` into `dist/` for production. |
| `bun run start` | Start the compiled production servers (requires `bun run build`). |
| `bun run lint` | Lint `src/**/*.ts` with ESLint and auto-fix where possible. |
| `bun run migrate` | Execute Sequelize migrations specified in `src/migrations/path.ts`. |
| `bun run seed` | Execute the admin seeder defined in `src/seeders/index.ts`. |

## Running with Docker
The repository ships with a Bun-based image and compose file that expects an external Docker network (`Content/Engagement Platform_network`) and `.env` file.

```bash
# Create the external network once
docker network create Content/Engagement Platform_network

# Build and run the API + bucket containers
docker compose up -d --build
```

What the container does (see `entrypoint.sh`):
1. Installs required OS packages (`build-essential`, `libvips`, etc.).
2. Waits for the MySQL host defined in `.env` to become reachable.
3. Runs migrations automatically.
4. Starts the API (`PORT`) and bucket (`BUCKET_PORT`) processes.

Volume `uploads` is mounted at `/app/uploads`, ensuring uploaded media persists across restarts.

## API Access & Security
- **Base URL:** `http://localhost:9000/api` (adjust port as needed).
- **API Key:** Every request (except `OPTIONS` and `/api/health`) must include an `Api-Key` header that matches `API_KEY` in `.env`.
- **Authentication:** Routes marked with `authorization: true` require a `Bearer <JWT>` header. JWTs are verified via `src/utils/token.ts`, and roles (`admin`, `user`, etc.) are enforced by `checkAuthentication`.
- **Guest tracking:** Anonymous requests receive a signed `guestId` cookie issued in `src/config/server.ts`.
- **Health:** `GET /` responds with `{ message: "Api is Working" }` for simple uptime checks.

## Domain Modules
Each feature lives in `src/modules/<feature>` with `attributes`, `model`, `controller`, `service`, and `migration` files. Key domains include:

| Module | Responsibility |
| --- | --- |
| `admins` | Admin auth, management, and permissions. |
| `categories`, `userCategories` | Topic taxonomy, user interests, and discovery. |
| `news`, `newsViews`, `bookmarks` | Article publishing, view tracking, and bookmark collections. |
| `comments`, `likes`, `polls`, `feedback` | Engagement and social interactions. |
| `ads`, `rewards`, `preferences` | Monetization, gamification, and personalization. |
| `notifications`, `userDeviceTokens` | Push notification campaigns and device token reContent/Engagement Platformry. |
| `otp`, `user` | Account lifecycle, OTP verification, and profile management. |
| `schedules`, `streaks`, `dashboard` | Scheduled jobs, streak tracking, and analytics endpoints. |

Routes are auto-reContent/Engagement Platformered from `src/routes/*.ts`, and each exports metadata describing the HTTP method, path, controller, and authorization requirements. All endpoints are exposed under `/api/<route>`.

## Background Jobs & Storage
- **Schedules:** `src/config/schedule.ts` loads entries from the `schedules` module, reContent/Engagement Platformers them with `node-schedule`, removes expired jobs, and adds a daily maintenance job.
- **Redis Cache:** `src/config/redis.ts` exposes helpers (`setCache`, `getCache`, `delCache`) for caching expensive responses.
- **Uploads Bucket:** `src/config/bucket.ts` serves the `uploads/` directory. Configure `BUCKET_PORT` and proxy from your CDN if needed.

## Testing & Linting
- **Linting:** `bun run lint`
- **Automated tests:** Not yet implemented. When adding tests, prefer Bun's built-in test runner or Vitest and document the workflow here.

## Contributing
1. Fork the repository and create a feature branch.
2. Ensure `bun run lint` passes.
3. Update or add migrations/seeders when introducing schema changes.
4. Submit a pull request describing the change along with manual testing notes.

## Troubleshooting
- **Database connection errors:** Confirm the DB host is reachable from your environment and credentials match `.env`.
- **Redis auth failures:** Ensure `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` (if any) are supplied.
- **Missing Firebase config:** Create `src/config/pushNotification.json` with valid service account credentials.
- **Uploads not served:** Verify the bucket server is running on `BUCKET_PORT` and the `uploads/` directory exists with proper permissions.
- **Docker compose fails:** Ensure the external network `Content/Engagement Platform_network` is created before `docker compose up`.

Need additional help? Open an issue or reach out to the Inflancer engineering team.
