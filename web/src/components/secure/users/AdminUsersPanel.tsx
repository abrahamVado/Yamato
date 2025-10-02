"use client";

import { useEffect } from "react";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { adminUserSchema } from "@/lib/validation/admin";
import { getStoredToken, setStoredToken } from "@/lib/api-client";

type Role = {
  id: number;
  name: string;
  display_name?: string;
};

type Team = {
  id: number;
  name: string;
  role: string;
};

type Profile = {
  id: number;
  phone?: string;
  name?: string;
  meta?: Record<string, unknown>;
};

type AdminUser = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  teams: Team[];
  profile: Profile | null;
};

export default function AdminUsersPanel() {
  //1.- Ensure the demo Sanctum token exists so the API requests succeed locally.
  useEffect(() => {
    if (!getStoredToken()) {
      setStoredToken("demo-sanctum-token");
    }
  }, []);

  const { items, isLoading, error, create } = useAdminResource<AdminUser>("/api/admin/users");

  async function handleSeedUser() {
    //1.- Build a unique payload, validate it with Zod, and trigger the mutation with optimism.
    const timestamp = Date.now();
    const payload = adminUserSchema.parse({
      name: `Seeded User ${timestamp}`,
      email: `seeded.user.${timestamp}@example.com`,
      password: "secret123",
      roles: [],
      teams: [],
      profile: { name: `Seeded User ${timestamp}` },
    });
    await create(payload, {
      optimistic: {
        id: timestamp,
        name: payload.name,
        email: payload.email,
        roles: [],
        teams: [],
        profile: { id: timestamp, name: payload.profile?.name },
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Users</h2>
        {/* //1.- Provide a quick action that seeds a demo user with optimistic updates. */}
        <button
          type="button"
          className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          onClick={handleSeedUser}
        >
          Seed user
        </button>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading users…</p>}
      {error && <p className="text-sm text-red-500">Failed to load users: {(error as Error).message}</p>}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Teams</th>
          </tr>
        </thead>
        <tbody>
          {items.map((user) => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="py-2 font-medium">{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles.map((role) => role.display_name ?? role.name).join(", ") || "—"}</td>
              <td>{user.teams.map((team) => `${team.name} (${team.role})`).join(", ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
