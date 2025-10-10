# Yamato

## Overview
Yamato is a Next.js 14 starter that assembles an authenticated dashboard experience with rich loading states, localization, and role-aware navigation. The application is wired through the App Router and wraps every page in shared providers for theming, i18n, toasts, and deployment announcements, so the UI shell is consistently configured across marketing and secure areas.【F:web/src/app/layout.tsx†L1-L47】

The project showcases reusable building blocks for SaaS-style dashboards:

- A locale-aware translation provider with persistence and runtime dictionary loading.【F:web/src/app/providers/I18nProvider.tsx†L1-L124】
- Loader guards that gate route transitions until assets or minimum durations complete, feeding into a customizable cat-themed spinner overlay.【F:web/src/components/AppShell.tsx†L1-L47】【F:web/src/components/LoaderGuard.tsx†L1-L125】
- Client helpers for role-based access control definitions and authenticated API access patterns that centralize token storage and error handling.【F:web/src/lib/rbac.ts†L1-L14】【F:web/src/lib/api-client.ts†L1-L59】
- Marketing copy and navigation metadata that reinforce the multi-tenant focus of the starter.【F:web/src/app/(public)/home/lang/en.json†L1-L32】

## Repository layout
- **Root workspace** – Holds shared tooling and npm scripts that delegate to the web frontend (`npm --prefix web …`).【F:package.json†L1-L29】
- **`tests/`** – Houses Node.js tests run through the built-in test runner to guard critical project automation.【F:tests/package-scripts.test.mjs†L1-L24】
- **`web/`** – The Next.js application containing the App Router tree, UI components, language packs, Tailwind styling, and lib helpers referenced above.【F:web/package.json†L1-L56】【F:web/src/app/layout.tsx†L1-L47】

## Getting started

### Prerequisites
- Node.js 18.17 or newer (required by Next.js 14.2.5) and npm.

### Install dependencies
```bash
# Install root-level tooling (Node test runner, shared utilities)
npm install

# Install the Next.js application dependencies
npm --prefix web install
```

### Verify the backend API
Before starting the frontend ensure the backend is running and healthy. The default backend instance
exposes a health probe at `http://localhost:8080/api/health`:

```bash
curl http://localhost:8080/api/health
```

A `200 OK` response confirms the API is ready for traffic. Keep the service running while you work
on the Next.js client so authenticated requests and uploads complete successfully. The upload
workflows respect the `NEXT_PUBLIC_UPLOAD_BACKEND` family of environment variables, so add
configuration such as `.env.local` when you need to point at a different host or switch between the
Go and Laravel upload targets.【F:web/src/lib/backend.ts†L1-L16】

### Configure the API client
Set `NEXT_PUBLIC_API_BASE_URL` in `web/.env.local` to the Laravel host plus its canonical `/api`
prefix (for example `http://localhost:8080/api`) so the shared API helpers route requests to the
correct backend.【F:web/.env.local†L1-L11】【F:docs/protected-admin-api/README.md†L6-L40】

### Run the development server
```bash
npm run dev
```
This starts `next dev` for the application under `web/` on port 3000 by default.【F:package.json†L4-L12】【F:web/package.json†L1-L12】
Keep the backend process from the previous step running so the API client can execute authenticated
requests against your services.【F:web/src/lib/api-client.ts†L1-L59】

### Build for production
```bash
npm run build
```
This compiles the Next.js application for production using `next build` via the delegated workspace script.【F:package.json†L4-L12】【F:web/package.json†L5-L11】

### Start a production server
```bash
npm run start
```
This runs `next start` inside the `web/` workspace to serve the compiled `.next` output.【F:package.json†L4-L12】【F:web/package.json†L5-L11】

### Linting and tests
```bash
npm run lint    # Delegates to next lint inside web/
npm test        # Runs the Node.js test suite at the repository root
npm run test:e2e  # Builds the Next.js app and executes Playwright tests
```
Linting and end-to-end checks execute inside the Next.js workspace, while the Node.js test runner validates root automation scripts.【F:package.json†L4-L20】【F:tests/package-scripts.test.mjs†L1-L24】【F:web/package.json†L5-L26】

## Dockerizing the application
The repository ships with production Dockerfiles at the root (`Dockerfile`) and inside the web
workspace (`web/Dockerfile`). Refer to `docs/docker/README.md` for detailed usage instructions, or
use the multi-stage build below to encapsulate the Next.js frontend and its root scripts:

```dockerfile
# Stage 1: install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY web/package.json ./web/
RUN npm install \
 && npm --prefix web install

# Stage 2: build the Next.js app
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules
COPY . .
RUN npm run build

# Stage 3: run the production server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/web/package.json ./web/
COPY --from=build /app/web/.next ./web/.next
COPY --from=build /app/web/public ./web/public
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run the container with:
```bash
docker build -t yamato-app .
docker run --rm -p 3000:3000 yamato-app
```
The container launches the production server on port 3000 using the same npm scripts defined in `package.json`.【F:package.json†L4-L12】

## Additional resources
- Component providers such as `ThemeProvider` and the i18n system ensure consistent UX across the application shell.【F:web/src/app/layout.tsx†L1-L47】【F:web/src/app/providers/I18nProvider.tsx†L1-L124】
- Explore `web/src/components/` for reusable admin panels, loaders, gameplay showcases, and shared UI primitives ready for composition across routes.【F:web/src/components/AppShell.tsx†L1-L47】【F:web/src/components/LoaderGuard.tsx†L1-L125】
