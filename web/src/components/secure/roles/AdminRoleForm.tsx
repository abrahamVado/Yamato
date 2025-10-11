"use client"

//1.- Build a form to create or update role definitions including permission assignments.
import { FormEvent, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdminResource } from "@/hooks/use-admin-resource"
import { adminRoleSchema } from "@/lib/validation/admin"

type Permission = {
  id: number
  name: string
  display_name?: string
  description?: string
}

type AdminRole = {
  id: number
  name: string
  display_name?: string
  description?: string
  permissions: Permission[]
}

type AdminRoleFormProps = {
  roleId?: number
}

export function AdminRoleForm({ roleId }: AdminRoleFormProps) {
  const { items, create, update } = useAdminResource<AdminRole>("admin/roles")
  const { items: permissionOptions } = useAdminResource<Permission>("admin/permissions")

  //2.- Resolve the role being edited so the UI stays in sync with the latest data.
  const activeRole = useMemo(() => items.find((role) => role.id === roleId), [items, roleId])

  const [name, setName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const isEditing = Boolean(roleId && activeRole)

  useEffect(() => {
    //3.- Hydrate the local state with the active role data when editing.
    if (!activeRole) {
      setName("")
      setDisplayName("")
      setDescription("")
      setSelectedPermissions([])
      return
    }
    setName(activeRole.name)
    setDisplayName(activeRole.display_name ?? "")
    setDescription(activeRole.description ?? "")
    setSelectedPermissions(activeRole.permissions.map((permission) => permission.id))
  }, [activeRole])

  function togglePermission(permissionId: number) {
    //4.- Toggle permissions immutably to keep React state predictable.
    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const payload = adminRoleSchema.parse({
        name: name.trim(),
        display_name: displayName.trim() || undefined,
        description: description.trim() || undefined,
        permissions: selectedPermissions,
      })
      if (isEditing && roleId) {
        //5.- Update an existing role and optimistically update the cache entry.
        await update(roleId, payload, {
          optimistic: {
            id: roleId,
            name: payload.name,
            display_name: payload.display_name,
            description: payload.description,
            permissions: selectedPermissions.map((permissionId) => {
              const match = permissionOptions.find((permission) => permission.id === permissionId)
              return match ?? { id: permissionId, name: `Permission ${permissionId}` }
            }),
          },
        })
      } else {
        const timestamp = Date.now()
        //6.- Create a new role and append it to the cache with the chosen permissions.
        await create(payload, {
          optimistic: {
            id: timestamp,
            name: payload.name,
            display_name: payload.display_name,
            description: payload.description,
            permissions: selectedPermissions.map((permissionId) => {
              const match = permissionOptions.find((permission) => permission.id === permissionId)
              return match ?? { id: permissionId, name: `Permission ${permissionId}` }
            }),
          },
        })
        setName("")
        setDisplayName("")
        setDescription("")
        setSelectedPermissions([])
      }
      setFormError(null)
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message)
      } else {
        setFormError("Unexpected validation error.")
      }
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="role-name">System name</Label>
        <Input
          id="role-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="navigator"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role-display-name">Display name</Label>
        <Input
          id="role-display-name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Navigator"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role-description">Description</Label>
        <Textarea
          id="role-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Explain what this role unlocks across Yamato."
          rows={3}
        />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Permissions</p>
          <p className="text-sm text-muted-foreground">Assign the actions this role should be able to execute.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {permissionOptions.map((permission) => (
            <label key={permission.id} className="flex items-start gap-3 rounded-md border px-3 py-2 text-sm">
              <Checkbox
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={() => togglePermission(permission.id)}
                aria-label={`Toggle permission ${permission.display_name ?? permission.name}`}
              />
              <span>
                <span className="block font-medium">{permission.display_name ?? permission.name}</span>
                {permission.description && (
                  <span className="text-xs text-muted-foreground">{permission.description}</span>
                )}
              </span>
            </label>
          ))}
          {permissionOptions.length === 0 && (
            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              No permissions available yet. Use the permissions editor to seed definitions.
            </p>
          )}
        </div>
      </div>
      {formError && <p className="text-sm text-red-500">{formError}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          setName(activeRole?.name ?? "")
          setDisplayName(activeRole?.display_name ?? "")
          setDescription(activeRole?.description ?? "")
          setSelectedPermissions(activeRole ? activeRole.permissions.map((permission) => permission.id) : [])
          setFormError(null)
        }}>
          Reset
        </Button>
        <Button type="submit">{isEditing ? "Update role" : "Create role"}</Button>
      </div>
    </form>
  )
}
