"use client"

//1.- Manage permission definitions so roles can reuse granular capabilities.
import { FormEvent, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdminResource } from "@/hooks/use-admin-resource"
import { adminPermissionSchema } from "@/lib/validation/admin"

type AdminPermission = {
  id: number
  name: string
  display_name?: string
  description?: string
}

export function RolePermissionsForm() {
  const { items, create, update } = useAdminResource<AdminPermission>("admin/permissions")

  //2.- Track the selected permission id so operators can edit existing records.
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined)
  const activePermission = useMemo(() => items.find((permission) => permission.id === selectedId), [items, selectedId])

  const [name, setName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [description, setDescription] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    //3.- Hydrate the form when switching between existing permissions.
    if (!activePermission) {
      setName("")
      setDisplayName("")
      setDescription("")
      return
    }
    setName(activePermission.name)
    setDisplayName(activePermission.display_name ?? "")
    setDescription(activePermission.description ?? "")
  }, [activePermission])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const payload = adminPermissionSchema.parse({
        name: name.trim(),
        display_name: displayName.trim() || undefined,
        description: description.trim() || undefined,
      })
      if (activePermission) {
        //4.- Update the selected permission and optimistically refresh the cache entry.
        await update(activePermission.id, payload, {
          optimistic: {
            id: activePermission.id,
            name: payload.name,
            display_name: payload.display_name,
            description: payload.description,
          },
        })
      } else {
        const timestamp = Date.now()
        //5.- Create a new permission and append it for immediate reuse in the role forms.
        await create(payload, {
          optimistic: {
            id: timestamp,
            name: payload.name,
            display_name: payload.display_name,
            description: payload.description,
          },
        })
        setName("")
        setDisplayName("")
        setDescription("")
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
        <Label htmlFor="permission-selector">Select existing permission</Label>
        <select
          id="permission-selector"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={selectedId ?? ""}
          onChange={(event) => {
            const value = event.target.value
            setSelectedId(value ? Number(value) : undefined)
          }}
        >
          <option value="">Create new permission…</option>
          {items.map((permission) => (
            <option key={permission.id} value={permission.id}>
              {permission.display_name ?? permission.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="permission-name">System name</Label>
        <Input
          id="permission-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="deploy.runbooks"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="permission-display-name">Display name</Label>
        <Input
          id="permission-display-name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Deploy runbooks"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="permission-description">Description</Label>
        <Textarea
          id="permission-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Explain what this permission unlocks for operators."
          rows={3}
        />
      </div>
      {formError && <p className="text-sm text-red-500">{formError}</p>}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSelectedId(undefined)
            setName("")
            setDisplayName("")
            setDescription("")
            setFormError(null)
          }}
        >
          Reset
        </Button>
        <Button type="submit">{activePermission ? "Update permission" : "Create permission"}</Button>
      </div>
    </form>
  )
}
