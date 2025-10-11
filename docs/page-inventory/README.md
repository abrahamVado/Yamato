# Page Inventory

Yamato's Next.js app router keeps public marketing surfaces separate from the authenticated console. The edge middleware redirects visitors who omit a locale prefix to `/en/...` and enforces Sanctum session cookies before letting them reach private screens.

## Public pages

### Marketing and onboarding
- `/` – Default landing path that re-exports the marketing home experience defined in `web/src/app/(public)/home/page.tsx`.
- `/home` – Full marketing home with feature highlights, KPI callouts, and locale-aware content blocks from `web/src/app/(public)/home/page.tsx`.
- `/loader` – Loader demonstration that simulates slow server work and renders a grid of eager images from `web/src/app/(public)/loader/page.tsx`.

### Authentication and account recovery
- `/login` – Locale-aware login flow that stores Sanctum tokens via `web/src/app/(public)/login/page.tsx`.
- `/register` – Registration form that provisions demo tenants and invites from `web/src/app/(public)/register/page.tsx`.
- `/forgot-password` – Password reset request form implemented in `web/src/app/(public)/forgot-password/page.tsx`.
- `/verify-email` – Email verification handling and resend form from `web/src/app/(public)/verify-email/page.tsx`.

### Documentation hub
- `/docs` – Documentation hub landing page in `web/src/app/(public)/docs/page.tsx`.
- `/docs/auth` – Authentication integration notes from `web/src/app/(public)/docs/auth/page.tsx`.
- `/docs/configuration` – Configuration checklist in `web/src/app/(public)/docs/configuration/page.tsx`.
- `/docs/deploy` – Deployment guide from `web/src/app/(public)/docs/deploy/page.tsx`.
- `/docs/examples/components` – Component examples page in `web/src/app/(public)/docs/examples/components/page.tsx`.
- `/docs/installation` – Installation walkthrough located at `web/src/app/(public)/docs/installation/page.tsx`.
- `/docs/observability` – Observability quickstart from `web/src/app/(public)/docs/observability/page.tsx`.
- `/docs/rbac` – RBAC overview sourced from `web/src/app/(public)/docs/rbac/page.tsx`.
- `/docs/tenants` – Tenant management guide from `web/src/app/(public)/docs/tenants/page.tsx`.
- `/docs/troubleshooting` – Troubleshooting FAQ in `web/src/app/(public)/docs/troubleshooting/page.tsx`.

### `/public` namespace aliases
- `/public/login` – Alias to the login flow in `web/src/app/public/login/page.tsx`.
- `/public/register` – Alias to the registration form in `web/src/app/public/register/page.tsx`.
- `/public/verify-email` – Alias for the verification flow in `web/src/app/public/verify-email/page.tsx`.

## Private pages

- `/private/dashboard` – Operator dashboard layout sourced from `web/src/app/private/dashboard/page.tsx`.
- `/private/modules` – Module marketplace shell at `web/src/app/private/modules/page.tsx`.
- `/private/profile` – Profile editor from `web/src/app/private/profile/page.tsx`.
- `/private/roles` – Role management grid at `web/src/app/private/roles/page.tsx`.
- `/private/roles/add-edit` – Modal wrapper used for creating and updating roles via `web/src/app/private/roles/add-edit/page.tsx`.
- `/private/roles/edit-permissions` – Permission editor overlay defined in `web/src/app/private/roles/edit-permissions/page.tsx`.
- `/private/security` – Security center overview in `web/src/app/private/security/page.tsx`.
- `/private/security/auth-tests` – Auth diagnostics panel from `web/src/app/private/security/auth-tests/page.tsx`.
- `/private/settings` – Workspace settings surface at `web/src/app/private/settings/page.tsx`.
- `/private/teams` – Team management view in `web/src/app/private/teams/page.tsx`.
- `/private/teams/add-edit` – Form surface for provisioning and renaming teams inside `web/src/app/private/teams/add-edit/page.tsx`.
- `/private/users` – User directory + admin panel at `web/src/app/private/users/page.tsx`.
- `/private/users/add-edit` – Admin-driven user creation and editing workflow from `web/src/app/private/users/add-edit/page.tsx`.
- `/private/views-analysis` – Analytics walkthrough from `web/src/app/private/views-analysis/page.tsx`.
