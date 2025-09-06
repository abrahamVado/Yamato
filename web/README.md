# Yamato Web — Full App

Public flows + private app (dashboard, users, user edit, config, teams, modules). Multi-tenant aware; event bus for cross-component comms; flags for public pages.

## Quick start
```bash
unzip yamato_web_full.zip -d .
cd web
npm i
cp .env.example .env
npm run dev
```
Open http://localhost:5173

## Auth note
Login is stubbed: submitting the form sets `authenticated` status locally. Wire real endpoints later (Phase 3).
