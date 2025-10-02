import { test, expect } from "@playwright/test";

const AUTH_HEADER = "Bearer demo-sanctum-token";

let profileId: number;
let profileUserId: number;

test.describe("Admin profiles API", () => {
  test("lists profiles with users", async ({ request }) => {
    //1.- Fetch the profiles index to ensure it returns an array payload.
    const response = await request.get("/api/admin/profiles", {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("creates a profile for a user", async ({ request }) => {
    //1.- Create a user that the profile will belong to.
    const timestamp = Date.now();
    const userResponse = await request.post("/api/admin/users", {
      headers: { authorization: AUTH_HEADER },
      data: {
        name: `Profile Subject ${timestamp}`,
        email: `profile.subject.${timestamp}@example.com`,
        password: "secret123",
      },
    });
    expect(userResponse.status()).toBe(201);
    profileUserId = (await userResponse.json()).data.id;

    //2.- Attach the profile payload to the newly created user.
    const response = await request.post("/api/admin/profiles", {
      headers: { authorization: AUTH_HEADER },
      data: {
        user_id: profileUserId,
        name: "Profile Subject",
        phone: "+15559999999",
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.user?.id).toBe(profileUserId);
    expect(body.data.phone).toBe("+15559999999");
    profileId = body.data.id;
  });

  test("shows the created profile", async ({ request }) => {
    //1.- Retrieve the profile to ensure the user relationship is present.
    const response = await request.get(`/api/admin/profiles/${profileId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(profileId);
    expect(body.data.user.id).toBe(profileUserId);
  });

  test("updates the profile details", async ({ request }) => {
    //1.- Update the profile with new metadata.
    const response = await request.patch(`/api/admin/profiles/${profileId}`, {
      headers: { authorization: AUTH_HEADER },
      data: {
        phone: "+15558888888",
        meta: { timezone: "UTC" },
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.phone).toBe("+15558888888");
    expect(body.data.meta).toEqual({ timezone: "UTC" });
  });

  test("deletes the profile and cleanup user", async ({ request }) => {
    //1.- Remove the profile record and confirm the response code.
    const response = await request.delete(`/api/admin/profiles/${profileId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(204);

    //2.- Delete the associated user to keep the store tidy.
    const userResponse = await request.delete(`/api/admin/users/${profileUserId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(userResponse.status()).toBe(204);
  });
});
