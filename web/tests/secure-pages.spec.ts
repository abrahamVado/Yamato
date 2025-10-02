import { test, expect } from "@playwright/test";

const AUTH_HEADER = "Bearer demo-sanctum-token";

const securePaths = [
  { path: "/api/secure/users", section: "users" },
  { path: "/api/secure/profile", section: "profile" },
  { path: "/api/secure/logs", section: "logs" },
  { path: "/api/secure/errors", section: "errors" },
];

test.describe("Secure section endpoints", () => {
  for (const { path, section } of securePaths) {
    test(`rejects unauthenticated access for ${section}`, async ({ request }) => {
      //1.- Call the secure endpoint without credentials to verify the guard.
      const response = await request.get(path);
      expect(response.status()).toBe(401);
      await expect(response.json()).resolves.toEqual({ message: "Unauthenticated." });
    });

    test(`returns authenticated payload for ${section}`, async ({ request }) => {
      //1.- Provide the Sanctum token to unlock the secure endpoint.
      const response = await request.get(path, {
        headers: {
          authorization: AUTH_HEADER,
        },
      });

      //2.- Confirm the meta section value matches the requested area.
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.user).toEqual({
        id: 1,
        name: "Demo User",
        email: "demo.user@example.com",
      });
      expect(body.meta).toEqual({ section });
    });
  }
});
