FROM oven/bun:latest

WORKDIR /app

# Install system dependencies first
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 

COPY package*.json /app/
# RUN bun install --no-cache
RUN bun install
ENV TZ=Asia/Kathmandu
COPY . .
RUN bun run build
EXPOSE 9050
EXPOSE 9052
