# Yamato Bootsland-style Landing (Vite + React + SCSS Modules)

## Prereqs
- Node **>= 20.19.0** (or >= 22.12.0)
- pnpm or npm

## Install & run
```bash
cd web
pnpm i        # or: npm i
pnpm run dev  # or: npm run dev
```

Open http://localhost:5173/

## Where things live
- `src/pages/public/AppPublicBootsland.jsx` — the landing page
- `src/styles/` — tokens, mixins, base styles, and `bootsland.scss`
- `public/` — placeholder images (replace with real assets)

## Dark mode
The layout toggles `.yamato.nocturne` via the button in the header.
