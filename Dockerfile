# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# install build tools for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci

COPY . .

# build TypeScript + fix path aliases
RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/build ./build

# create non-root user FIRST
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# create logs directory and give permissions
RUN mkdir -p /app/logs && chown -R nodeuser:nodegroup /app

USER nodeuser

EXPOSE 5000

CMD ["node", "build/server.js"]