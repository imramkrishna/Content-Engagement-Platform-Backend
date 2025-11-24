#!/bin/bash
set -e

# -------------------------------
# 1. Install system dependencies
# -------------------------------
echo "Installing system dependencies..."
apt update && apt install -y \
    build-essential \
    libvips-dev \
    python3 \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*


# -------------------------------
# 3. Wait for the database to be ready
# -------------------------------
echo "Waiting for the database to be ready..."
until bun run -e "
import mysql from 'mysql2/promise';
(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        await connection.end();
    } catch (err) {
        process.exit(1);
    }
})()
" > /dev/null 2>&1; do
    echo "Database is not ready, retrying..."
    sleep 2
done
echo "Database is ready!"

# -------------------------------
# 4. Run migrations
# -------------------------------
echo "Running migrations..."
bun run migrate

# -------------------------------
# 5. Start the application
# -------------------------------
echo "Starting the application..."
bun run start
