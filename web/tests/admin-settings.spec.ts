import { test, expect } from "@playwright/test";

const AUTH_HEADER = "Bearer demo-sanctum-token";

let settingId: number;

test.describe("Admin settings API", () => {
  test("lists settings", async ({ request }) => {
    //1.- Fetch the settings collection to confirm ordering.
    const response = await request.get("/api/admin/settings", {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toHaveProperty("key");
  });

  test("creates a setting", async ({ request }) => {
    //1.- Register a new configuration key.
    const response = await request.post("/api/admin/settings", {
      headers: { authorization: AUTH_HEADER },
      data: {
        key: "integration.mode",
        value: "enabled",
        type: "string",
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.key).toBe("integration.mode");
    settingId = body.data.id;
  });

  test("shows the created setting", async ({ request }) => {
    //1.- Fetch the setting by id to confirm persistence.
    const response = await request.get(`/api/admin/settings/${settingId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(settingId);
    expect(body.data.key).toBe("integration.mode");
  });

  test("updates the setting", async ({ request }) => {
    //1.- Adjust the stored value to confirm updates succeed.
    const response = await request.patch(`/api/admin/settings/${settingId}`, {
      headers: { authorization: AUTH_HEADER },
      data: {
        value: "disabled",
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.value).toBe("disabled");
  });

  test("deletes the setting", async ({ request }) => {
    //1.- Remove the setting to keep the store clean.
    const response = await request.delete(`/api/admin/settings/${settingId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(204);
  });
});
