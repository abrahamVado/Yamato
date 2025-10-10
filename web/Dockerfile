# syntax=docker/dockerfile:1.7

# //1.- Install the Next.js workspace dependencies with npm for reproducible builds.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./package.json
RUN npm install

# //2.- Build the production bundle for the Next.js application.
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# //3.- Serve the compiled site with a non-root user in a slim runtime image.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S yamato \
  && adduser -S yamato -G yamato
USER yamato
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]
