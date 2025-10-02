import { test, expect } from "@playwright/test";

const AUTH_HEADER = "Bearer demo-sanctum-token";

let teamId: number;
let teamUserId: number;

test.describe("Admin teams API", () => {
  test("lists teams with members", async ({ request }) => {
    //1.- Fetch the teams index to ensure member relationships are present.
    const response = await request.get("/api/admin/teams", {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(Array.isArray(body.data[0].members)).toBe(true);
  });

  test("creates a team with members", async ({ request }) => {
    //1.- Create a supporting user that will join the team.
    const userResponse = await request.post("/api/admin/users", {
      headers: { authorization: AUTH_HEADER },
      data: {
        name: "Team Member",
        email: "team.member@example.com",
        password: "secret123",
      },
    });
    expect(userResponse.status()).toBe(201);
    teamUserId = (await userResponse.json()).data.id;

    //2.- Create the team with the new member included.
    const response = await request.post("/api/admin/teams", {
      headers: { authorization: AUTH_HEADER },
      data: {
        name: "Quality Assurance",
        description: "QA squad",
        members: [{ id: teamUserId, role: "lead" }],
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.name).toBe("Quality Assurance");
    expect(body.data.members[0].user.id).toBe(teamUserId);
    expect(body.data.members[0].role).toBe("lead");
    teamId = body.data.id;
  });

  test("shows the created team", async ({ request }) => {
    //1.- Retrieve the team and confirm the member hydration.
    const response = await request.get(`/api/admin/teams/${teamId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(teamId);
    expect(body.data.members[0].user.id).toBe(teamUserId);
  });

  test("updates the team and member roles", async ({ request }) => {
    //1.- Update the team description and member role assignment.
    const response = await request.patch(`/api/admin/teams/${teamId}`, {
      headers: { authorization: AUTH_HEADER },
      data: {
        description: "Updated QA squad",
        members: [{ id: teamUserId, role: "mentor" }],
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.description).toBe("Updated QA squad");
    expect(body.data.members[0].role).toBe("mentor");
  });

  test("deletes the team and cleanup member", async ({ request }) => {
    //1.- Remove the team to restore the initial state.
    const response = await request.delete(`/api/admin/teams/${teamId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(response.status()).toBe(204);

    //2.- Delete the temporary user created for the team.
    const userResponse = await request.delete(`/api/admin/users/${teamUserId}`, {
      headers: { authorization: AUTH_HEADER },
    });
    expect(userResponse.status()).toBe(204);
  });
});
