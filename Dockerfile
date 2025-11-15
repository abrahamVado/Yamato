# syntax=docker/dockerfile:1.7

########################
# 1) Dependencies
########################
FROM node:20-alpine AS deps
WORKDIR /app/web

# Recommended for Next.js on Alpine
RUN apk add --no-cache libc6-compat

# Copy package metadata (lockfile is optional)
COPY web/package.json web/package-lock.json* ./

# Install all deps (dev + prod) for the build stage
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

########################
# 2) Build
########################
FROM node:20-alpine AS build
WORKDIR /app/web

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/web/node_modules ./node_modules
COPY web/ .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

########################
# 3) Runtime
########################
FROM node:20-alpine AS runner
WORKDIR /app/web

RUN apk add --no-cache libc6-compat \
  && addgroup -S app && adduser -S app -G app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER app

# Only what we need at runtime
COPY --from=deps  /app/web/node_modules ./node_modules
COPY --from=build /app/web/.next        ./.next
COPY --from=build /app/web/public       ./public
COPY web/package.json ./package.json
# If you use next.config.* at runtime, also:
# COPY web/next.config.* ./

EXPOSE 3000

CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3000"]
