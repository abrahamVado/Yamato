# Protected & Admin API Task List

1. Implement the `GET /api/secure/dashboard` endpoint so it returns the authenticated user resource plus `{ "section": "dashboard", "message": "Authenticated access granted." }` while enforcing Sanctum authentication.
2. Implement the `GET /api/secure/users` endpoint to return the authenticated user resource with a meta section of `"users"` under Sanctum protection.
3. Implement the `GET /api/secure/profile` endpoint so it returns the authenticated user resource with a meta section of `"profile"` under Sanctum protection.
4. Implement the `GET /api/secure/logs` endpoint so it returns the authenticated user resource with a meta section of `"logs"` under Sanctum protection.
5. Implement the `GET /api/secure/errors` endpoint so it returns the authenticated user resource with a meta section of `"errors"` under Sanctum protection.
6. Build the admin users listing (`GET /api/admin/users`) that eagerly loads roles, teams, and profile data for each user.
7. Build the admin users creation flow (`POST /api/admin/users`) validating `name`, `email`, `password`, handling optional `roles`, `teams` entries of `{ id, role }`, and optional `profile` payloads.
8. Build the admin users show endpoint (`GET /api/admin/users/{id}`) returning the user with loaded relationships.
9. Build the admin users update endpoint (`PUT/PATCH /api/admin/users/{id}`) reusing the create schema with optional fields and conditional password updates.
10. Build the admin users deletion endpoint (`DELETE /api/admin/users/{id}`) that responds with HTTP 204 on success.
11. Build the admin roles listing endpoint (`GET /api/admin/roles`) returning roles with permissions eager-loaded.
12. Build the admin roles creation endpoint (`POST /api/admin/roles`) validating unique `name` and handling optional `display_name`, `description`, and `permissions` ID arrays.
13. Build the admin roles show endpoint (`GET /api/admin/roles/{id}`) including the permissions relationship.
14. Build the admin roles update endpoint (`PUT/PATCH /api/admin/roles/{id}`) mirroring the create schema and syncing permissions when provided.
15. Build the admin roles deletion endpoint (`DELETE /api/admin/roles/{id}`) that returns HTTP 204 after removal.
16. Build the admin permissions listing endpoint (`GET /api/admin/permissions`) returning the ordered permission collection.
17. Build the admin permissions creation endpoint (`POST /api/admin/permissions`) enforcing unique `name` and optional `display_name` and `description` fields.
18. Build the admin permissions show endpoint (`GET /api/admin/permissions/{id}`) returning the single permission record.
19. Build the admin permissions update endpoint (`PUT/PATCH /api/admin/permissions/{id}`) enforcing uniqueness on `name` and allowing optional fields.
20. Build the admin permissions deletion endpoint (`DELETE /api/admin/permissions/{id}`) returning HTTP 204 on success.
21. Build the admin profiles listing endpoint (`GET /api/admin/profiles`) returning profiles with eager-loaded user relationships.
22. Build the admin profiles creation endpoint (`POST /api/admin/profiles`) validating unique `user_id` with optional `name`, `phone`, and `meta` fields.
23. Build the admin profiles show endpoint (`GET /api/admin/profiles/{id}`) returning the profile with the user relationship.
24. Build the admin profiles update endpoint (`PUT/PATCH /api/admin/profiles/{id}`) reusing the create schema with optional fields while keeping `user_id` unique.
25. Build the admin profiles deletion endpoint (`DELETE /api/admin/profiles/{id}`) returning HTTP 204 when removed.
26. Build the admin teams listing endpoint (`GET /api/admin/teams`) returning teams with member relationships.
27. Build the admin teams creation endpoint (`POST /api/admin/teams`) validating unique `name`, optional `description`, and handling `members` arrays of `{ id, role }`.
28. Build the admin teams show endpoint (`GET /api/admin/teams/{id}`) returning the team with members.
29. Build the admin teams update endpoint (`PUT/PATCH /api/admin/teams/{id}`) reusing the create schema and syncing relationships.
30. Build the admin teams deletion endpoint (`DELETE /api/admin/teams/{id}`) returning HTTP 204 when removed.
31. Build the admin settings listing endpoint (`GET /api/admin/settings`) returning all settings ordered by key.
32. Build the admin settings creation endpoint (`POST /api/admin/settings`) validating unique `key` and accepting `value` and `type`.
33. Build the admin settings show endpoint (`GET /api/admin/settings/{id}`) returning the setting object.
34. Build the admin settings update endpoint (`PUT/PATCH /api/admin/settings/{id}`) mirroring the create schema with uniqueness enforced on `key`.
35. Build the admin settings deletion endpoint (`DELETE /api/admin/settings/{id}`) returning HTTP 204 on success.
36. Implement a front-end workflow that fetches the relevant admin list endpoint (e.g., `/api/admin/users`) on page load or via SWR/React Query to populate dashboard tables.
37. Implement client-side validation schemas (e.g., Zod) mirroring the backend validation rules for the admin forms.
38. Implement mutation handlers that submit to the REST endpoints and perform optimistic updates on successful `2xx` responses.
39. Implement error handling that redirects to the login flow and clears stored tokens when receiving `401` or `419` responses.
