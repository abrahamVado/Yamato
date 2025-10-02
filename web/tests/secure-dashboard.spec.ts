import { test, expect } from "@playwright/test";

const AUTH_HEADER = "Bearer demo-sanctum-token";

test.describe("Secure dashboard endpoint", () => {
  test("returns 401 when authentication is missing", async ({ request }) => {
    //1.- Trigger the route without credentials to confirm the guard rejects the request.
    const response = await request.get("/api/secure/dashboard");
    expect(response.status()).toBe(401);

    //2.- Verify the payload mirrors Laravel Sanctum's unauthenticated structure for the frontend guard.
    await expect(response.json()).resolves.toEqual({ message: "Unauthenticated." });
  });

  test("returns the authenticated user payload when provided a valid token", async ({ request }) => {
    //1.- Include the Bearer token to simulate a successful Sanctum-authenticated request.
    const response = await request.get("/api/secure/dashboard", {
      headers: {
        authorization: AUTH_HEADER,
      },
    });

    //2.- The route should succeed and provide the expected metadata structure.
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toEqual({
      user: {
        id: 1,
        name: "Demo User",
        email: "demo.user@example.com",
      },
      meta: {
        section: "dashboard",
        message: "Authenticated access granted.",
      },
    });
  });
});
