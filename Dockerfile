# syntax=docker/dockerfile:1.7

# //1.- Install root and web workspace dependencies once so subsequent stages can reuse them.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY web/package.json ./web/
RUN npm ci \
  && npm --prefix web install

# //2.- Build the Next.js application using the installed dependencies.
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules
COPY . .
RUN npm run build

# //3.- Create a minimal runtime image with the production build output.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S yamato \
  && adduser -S yamato -G yamato
USER yamato
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/web/package.json ./web/package.json
COPY --from=build /app/web/.next ./web/.next
COPY --from=build /app/web/public ./web/public
EXPOSE 3000
CMD ["npm", "run", "start"]
