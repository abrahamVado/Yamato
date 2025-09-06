# Yamato SCSS (Sass Modules)

A hierarchical, `@use`-first SCSS setup for your Yamato UI. No deprecated `@import` and no global leakage.

## Structure
- `_tokens.scss` — design tokens (breakpoints, spacing, radii, z-index, CSS variables)
- `_functions.scss` — helpers to read tokens: `bp()`, `space()`, `radius()`, `z()`
- `_mixins.scss` — layout and UI mixins: `up()`, `container()`, `button()`, `card()`
- `_foundation.scss` — optional barrel that forwards tokens/functions/mixins
- `_reset.scss` — minimal, modern reset
- `base/` — typography and utility classes
- `layout/` — grid utilities
- `components/` — header, footer, hero, buttons, cards, cannon, motor, pipes
- `themes/_nocturne.scss` — dark theme overrides

## Use in Vite
Import once in your React entry:
```js
import '@/assets/styles/yamato.scss'
```

Or plain CSS (compiled by Vite) via relative path:
```js
import './assets/styles/yamato.scss'
```

## Component mixins
Because we use `@use`, mixins and variables are **not global**. Each partial that calls a mixin already does:
```scss
@use "../mixins" as m;
.cannon { @include m.card; }
```

## Theme switch
Toggle nocturne with a class:
```js
document.querySelector('.yamato')?.classList.toggle('nocturne', true)
```
or using a parent attribute:
```html
<body data-theme="nocturne">…</body>
```
