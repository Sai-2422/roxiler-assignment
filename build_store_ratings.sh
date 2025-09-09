#!/usr/bin/env bash
set -euo pipefail

ROOT="store-ratings-platform"
rm -rf "$ROOT"
mkdir -p "$ROOT"
cd "$ROOT"

python3 - << 'PY'
import os, json, textwrap, pathlib

files = {
"docker-compose.yml": """\
version: "3.9"
services:
  db:
    image: postgres:15-alpine
    container_name: store_ratings_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d app"]
      interval: 5s
      timeout: 5s
      retries: 10

  api:
    build: ./backend
    container_name: store_ratings_api
    depends_on:
      db:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: "4000"
      JWT_SECRET: "CHANGE_ME_LONG_RANDOM_STRING"
      CORS_ORIGIN: "http://localhost:5173"
      DATABASE_URL: "postgresql://postgres:postgres@db:5432/app?schema=public"
      COOKIE_SECURE: "false"
    ports:
      - "4000:4000"
    command: [ "sh", "-lc", "npm run setup && npm run start" ]

  web:
    build: ./frontend
    container_name: store_ratings_web
    depends_on:
      - api
    environment:
      VITE_API_BASE_URL: "http://localhost:4000"
    ports:
      - "5173:5173"
    command: [ "sh", "-lc", "npm run preview -- --host 0.0.0.0 --port 5173" ]

volumes:
  pg_data:
""",

"README.md": """\
# Store Ratings Platform

A complete, Docker-first, production-grade implementation of the **FullStack Intern Coding Challenge**.

## Run with Docker

```bash
docker compose up -d --build
