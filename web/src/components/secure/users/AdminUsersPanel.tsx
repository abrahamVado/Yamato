"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { adminUserSchema } from "@/lib/validation/admin";

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
  const { items, isLoading, error, create, refresh } = useAdminResource<AdminUser>("admin/users");

  //1.- Track whether we have any rows to drive the empty state messaging.
  const hasUsers = useMemo(() => items.length > 0, [items.length]);

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

  //2.- Present the management table with contextual actions and safety messaging.
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage the operators who can access Yamato’s control room and invite collaborators.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={refresh}>
            Refresh
          </Button>
          <Button type="button" onClick={handleSeedUser}>
            Seed user
          </Button>
          <Button asChild variant="secondary">
            <Link href="/private/users/add-edit">Add user</Link>
          </Button>
        </div>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading users…</p>}
      {error && <p className="text-sm text-red-500">Failed to load users: {(error as Error).message}</p>}
      {!isLoading && !error && !hasUsers ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          No operators found yet. Seed a demo profile or create one manually to populate the directory.
        </div>
      ) : (
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
      )}
    </div>
  );
}
