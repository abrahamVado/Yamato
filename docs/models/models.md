# Secure Area Navigation Source of Truth

## Overview
- The secure Next.js routes under `web/src/app/private` now render empty shells so that only the navigation chrome remains visible for administrators.
- Each route returns `null`, ensuring the sidebar and top navigation managed by `AdminPanelLayout` stay intact without rendering legacy dashboards.

## Route Inventory
- `/private/dashboard`
- `/private/modules`
- `/private/users`
- `/private/users/add-edit`
- `/private/teams`
- `/private/teams/add-edit`
- `/private/roles`
- `/private/roles/add-edit`
- `/private/roles/edit-permissions`
- `/private/settings`
- `/private/views-analysis`
- `/private/profile`
- `/private/security`
- `/private/security/auth-tests`

## Navigation Components
- Sidebar and related chrome live in `web/src/components/admin-panel`.
- The preserved private navbar utilities reside in `web/src/components/private`.
- Shared layout composition remains in `web/src/app/private/layout.tsx`.

## Maintenance Checklist
1. Keep private page files returning `null` so only navigation is rendered.
2. When adding future content, recreate dedicated view components instead of editing the placeholders directly.
3. Ensure new documentation continues to live beside this file in its own folder.
