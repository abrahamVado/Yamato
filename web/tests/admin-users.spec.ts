import { test, expect } from "@playwright/test";

const AUTH_HEADER = "Bearer demo-sanctum-token";

let createdUserId: number;

test.describe("Admin users API", () => {
  test("lists users with eager-loaded relationships", async ({ request }) => {
    //1.- Fetch the users index to confirm the relationships are expanded.
    const response = await request.get("/api/admin/users", {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    const demoUser = body.data.find((user: any) => user.email === "demo.user@example.com");
    expect(demoUser).toBeDefined();
    expect(Array.isArray(demoUser.roles)).toBe(true);
    expect(Array.isArray(demoUser.teams)).toBe(true);
  });

  test("creates a user with roles, teams, and profile", async ({ request }) => {
    //1.- Submit the creation payload with roles, teams, and profile data.
    const response = await request.post("/api/admin/users", {
      headers: { authorization: AUTH_HEADER },
      data: {
        name: "Integration User",
        email: "integration.user@example.com",
        password: "secret123",
        roles: [2],
        teams: [{ id: 1, role: "member" }],
        profile: { name: "Integration User", phone: "+15551234567" },
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.email).toBe("integration.user@example.com");
    expect(body.data.roles[0].name).toBe("manager");
    expect(body.data.teams[0].role).toBe("member");
    expect(body.data.profile?.phone).toBe("+15551234567");
    createdUserId = body.data.id;
  });

  test("shows the created user", async ({ request }) => {
    //1.- Retrieve the recently created user to verify relationship hydration.
    const response = await request.get(`/api/admin/users/${createdUserId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(createdUserId);
    expect(body.data.roles[0].name).toBe("manager");
    expect(body.data.teams[0].role).toBe("member");
  });

  test("updates the user with optional fields", async ({ request }) => {
    //1.- Modify the user to clear roles and adjust the profile data.
    const response = await request.patch(`/api/admin/users/${createdUserId}`, {
      headers: { authorization: AUTH_HEADER },
      data: {
        name: "Updated Integration User",
        roles: [],
        teams: [],
        profile: { phone: "+15550000000" },
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.name).toBe("Updated Integration User");
    expect(body.data.roles).toHaveLength(0);
    expect(body.data.teams).toHaveLength(0);
    expect(body.data.profile?.phone).toBe("+15550000000");
  });

  test("deletes the user", async ({ request }) => {
    //1.- Remove the user and ensure the API returns the expected status code.
    const response = await request.delete(`/api/admin/users/${createdUserId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(204);
  });
});
