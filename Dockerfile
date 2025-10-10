# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS deps
WORKDIR /app/web
COPY web/package.json ./
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app/web
COPY --from=deps /app/web/node_modules ./node_modules
COPY web/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/web
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
USER app
COPY --from=deps  /app/web/node_modules ./node_modules
COPY --from=build /app/web/.next        ./.next
COPY --from=build /app/web/public       ./public
COPY web/package.json ./package.json
EXPOSE 3000
CMD ["node","./node_modules/next/dist/bin/next","start","-p","3000"]
