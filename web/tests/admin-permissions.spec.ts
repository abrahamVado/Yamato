import { test, expect } from "@playwright/test";

const AUTH_HEADER = "Bearer demo-sanctum-token";

let createdPermissionId: number;

test.describe("Admin permissions API", () => {
  test("lists permissions", async ({ request }) => {
    //1.- Retrieve the ordered permission list to ensure availability.
    const response = await request.get("/api/admin/permissions", {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toHaveProperty("name");
  });

  test("creates a permission", async ({ request }) => {
    //1.- Register a new permission for integration testing purposes.
    const response = await request.post("/api/admin/permissions", {
      headers: { authorization: AUTH_HEADER },
      data: {
        name: "integration.permission",
        display_name: "Integration Permission",
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.name).toBe("integration.permission");
    createdPermissionId = body.data.id;
  });

  test("shows the created permission", async ({ request }) => {
    //1.- Fetch the permission by id to confirm persistence.
    const response = await request.get(`/api/admin/permissions/${createdPermissionId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(createdPermissionId);
    expect(body.data.name).toBe("integration.permission");
  });

  test("updates the permission", async ({ request }) => {
    //1.- Adjust the permission metadata.
    const response = await request.patch(`/api/admin/permissions/${createdPermissionId}`, {
      headers: { authorization: AUTH_HEADER },
      data: {
        display_name: "Updated Integration Permission",
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.display_name).toBe("Updated Integration Permission");
  });

  test("deletes the permission", async ({ request }) => {
    //1.- Remove the test permission to keep the in-memory store tidy.
    const response = await request.delete(`/api/admin/permissions/${createdPermissionId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(204);
  });
});
