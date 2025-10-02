import { test, expect } from "@playwright/test";

const AUTH_HEADER = "Bearer demo-sanctum-token";

let createdRoleId: number;

test.describe("Admin roles API", () => {
  test("lists roles with permissions", async ({ request }) => {
    //1.- Request the roles collection to ensure permissions are eager-loaded.
    const response = await request.get("/api/admin/roles", {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(Array.isArray(body.data[0].permissions)).toBe(true);
  });

  test("creates a role with permission assignments", async ({ request }) => {
    //1.- Submit a new role with associated permission identifiers.
    const response = await request.post("/api/admin/roles", {
      headers: { authorization: AUTH_HEADER },
      data: {
        name: "integration-role",
        display_name: "Integration Role",
        description: "Role created during integration tests",
        permissions: [1, 2],
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.name).toBe("integration-role");
    expect(body.data.permissions).toHaveLength(2);
    createdRoleId = body.data.id;
  });

  test("shows the created role", async ({ request }) => {
    //1.- Retrieve the role detail to confirm it includes permissions.
    const response = await request.get(`/api/admin/roles/${createdRoleId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(createdRoleId);
    expect(body.data.permissions).toHaveLength(2);
  });

  test("updates the role and syncs permissions", async ({ request }) => {
    //1.- Adjust the role metadata and provide a new permission set.
    const response = await request.patch(`/api/admin/roles/${createdRoleId}`, {
      headers: { authorization: AUTH_HEADER },
      data: {
        display_name: "Updated Integration Role",
        permissions: [3],
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.display_name).toBe("Updated Integration Role");
    expect(body.data.permissions.map((perm: any) => perm.id)).toEqual([3]);
  });

  test("deletes the role", async ({ request }) => {
    //1.- Remove the created role to leave the store clean for other tests.
    const response = await request.delete(`/api/admin/roles/${createdRoleId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(204);
  });
});
