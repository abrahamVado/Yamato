"use client"

//1.- Provide a concise control surface for auditing and seeding Yamato roles.
import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdminResource } from "@/hooks/use-admin-resource"
import { adminRoleSchema } from "@/lib/validation/admin"

type Permission = {
  id: number
  name: string
  display_name?: string
}

type AdminRole = {
  id: number
  name: string
  display_name?: string
  description?: string
  permissions: Permission[]
}

export default function AdminRolesPanel() {
  const { items, isLoading, error, create, refresh } = useAdminResource<AdminRole>("admin/roles")

  //2.- Track whether the dataset is empty to drive the empty state.
  const hasRoles = useMemo(() => items.length > 0, [items.length])

  async function handleSeedRole() {
    //3.- Generate a deterministic payload and rely on Zod for structural validation before creating it.
    const timestamp = Date.now()
    const payload = adminRoleSchema.parse({
      name: `seed-role-${timestamp}`,
      display_name: `Seeded Role ${timestamp}`,
      description: "Local preview of a role seeded from the dashboard.",
      permissions: [],
    })
    await create(payload, {
      optimistic: {
        id: timestamp,
        name: payload.name,
        display_name: payload.display_name,
        description: payload.description,
        permissions: [],
      },
    })
  }

  //4.- Render the matrix with quick filters and contextual documentation links.
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Roles</h2>
          <p className="text-sm text-muted-foreground">
            Curate responsibilities for every crew before handing out production access.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={refresh}>
            Refresh
          </Button>
          <Button type="button" onClick={handleSeedRole}>
            Seed role
          </Button>
          <Button asChild variant="secondary">
            <Link href="/private/roles/add-edit">Add role</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/private/roles/edit-permissions">Edit permissions</Link>
          </Button>
        </div>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading roles…</p>}
      {error && <p className="text-sm text-red-500">Failed to load roles: {(error as Error).message}</p>}
      {!isLoading && !error && !hasRoles ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          No roles configured yet. Seed one to try the workflow or create a fresh role with the button above.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((role) => (
            <div key={role.id} className="rounded-md border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{role.display_name ?? role.name}</h3>
                  <p className="text-xs text-muted-foreground">Slug: {role.name}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.length > 0 ? (
                    role.permissions.map((permission) => (
                      <Badge key={permission.id} variant="secondary" className="text-xs">
                        {permission.display_name ?? permission.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No permissions</Badge>
                  )}
                </div>
              </div>
              {role.description && <p className="mt-3 text-sm text-muted-foreground">{role.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
