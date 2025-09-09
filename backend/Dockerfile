# backend/Dockerfile
FROM node:20-bullseye-slim

WORKDIR /app

# Ensure OpenSSL is present
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --quiet

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 4000
CMD ["sh","-lc","npm run setup && npm run start"]
