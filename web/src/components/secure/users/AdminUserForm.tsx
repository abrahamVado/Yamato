"use client"

//1.- Deliver a unified form for creating or updating Yamato operator accounts.
import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdminResource } from "@/hooks/use-admin-resource"
import { adminUserSchema } from "@/lib/validation/admin"

type Role = {
  id: number
  name: string
  display_name?: string
}

type Team = {
  id: number
  name: string
}

type TeamMembership = {
  id: number
  role: string
}

type Profile = {
  name?: string
  phone?: string
}

type AdminUser = {
  id: number
  name: string
  email: string
  roles: Role[]
  teams: (TeamMembership & { name?: string })[]
  profile: Profile | null
}

type AdminUserFormProps = {
  userId?: number
}

export function AdminUserForm({ userId }: AdminUserFormProps) {
  const { items, create, update } = useAdminResource<AdminUser>("admin/users")
  const { items: roleOptions } = useAdminResource<Role>("admin/roles")
  const { items: teamOptions } = useAdminResource<Team>("admin/teams")

  //2.- Resolve the currently edited operator (if any) so the UI hydrates with existing data.
  const activeUser = useMemo(() => items.find((user) => user.id === userId), [items, userId])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMembership[]>([])
  const [teamIdInput, setTeamIdInput] = useState("")
  const [teamRoleInput, setTeamRoleInput] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const isEditing = Boolean(userId && activeUser)

  useEffect(() => {
    //3.- Keep the local state synchronized whenever the underlying operator record changes.
    if (!activeUser) {
      setName("")
      setEmail("")
      setPassword("")
      setPhone("")
      setBio("")
      setSelectedRoles([])
      setTeamMembers([])
      return
    }
    setName(activeUser.name)
    setEmail(activeUser.email)
    setPassword("")
    setPhone(activeUser.profile?.phone ?? "")
    setBio(activeUser.profile?.name ?? "")
    setSelectedRoles(activeUser.roles.map((role) => role.id))
    setTeamMembers(activeUser.teams.map((team) => ({ id: team.id, role: team.role })))
  }, [activeUser])

  function toggleRole(roleId: number) {
    //4.- Toggle a role selection while preserving immutability for the checkboxes.
    setSelectedRoles((current) =>
      current.includes(roleId) ? current.filter((id) => id !== roleId) : [...current, roleId],
    )
  }

  //5.- Capture team assignments by pushing validated entries into state.
  function handleAddTeam() {
    const numericId = Number(teamIdInput)
    if (!numericId || Number.isNaN(numericId)) {
      setFormError("Provide a valid numeric team id before assigning it to the operator.")
      return
    }
    const trimmedRole = teamRoleInput.trim() || "Member"
    setTeamMembers((current) => [...current.filter((team) => team.id !== numericId), { id: numericId, role: trimmedRole }])
    setTeamIdInput("")
    setTeamRoleInput("")
    setFormError(null)
  }

  function handleRemoveTeam(id: number) {
    //6.- Allow removing stale assignments without resetting the rest of the form.
    setTeamMembers((current) => current.filter((team) => team.id !== id))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    //7.- Enforce a password floor when onboarding fresh operators.
    if (!isEditing && password.trim().length < 6) {
      setFormError("Password must be at least six characters when creating a new operator.")
      return
    }
    try {
      const payload = adminUserSchema.extend({ password: adminUserSchema.shape.password.optional() }).parse({
        name: name.trim(),
        email: email.trim(),
        password: password.trim() || undefined,
        roles: selectedRoles,
        teams: teamMembers.map((team) => ({ id: team.id, role: team.role })),
        profile:
          bio.trim() || phone.trim()
            ? {
                name: bio.trim() || undefined,
                phone: phone.trim() || undefined,
              }
            : undefined,
      })

      if (isEditing && userId) {
        //8.- Issue an update when editing and merge the response optimistically into the cache.
        await update(userId, payload, {
          optimistic: {
            id: userId,
            name: payload.name,
            email: payload.email,
            roles: selectedRoles.map((roleId) => {
              const match = roleOptions.find((role) => role.id === roleId)
              return match ?? { id: roleId, name: `Role ${roleId}` }
            }),
            teams: teamMembers.map((team) => ({
              id: team.id,
              role: team.role,
              name: teamOptions.find((candidate) => candidate.id === team.id)?.name,
            })),
            profile: payload.profile ?? null,
          },
        })
      } else {
        const timestamp = Date.now()
        //9.- Create new operators with optimistic hydration so they appear immediately in the list view.
        await create({ ...payload, password: payload.password ?? "temporary123" }, {
          optimistic: {
            id: timestamp,
            name: payload.name,
            email: payload.email,
            roles: selectedRoles.map((roleId) => {
              const match = roleOptions.find((role) => role.id === roleId)
              return match ?? { id: roleId, name: `Role ${roleId}` }
            }),
            teams: teamMembers.map((team) => ({
              id: team.id,
              role: team.role,
              name: teamOptions.find((candidate) => candidate.id === team.id)?.name,
            })),
            profile: payload.profile ?? null,
          },
        })
        setName("")
        setEmail("")
        setPassword("")
        setPhone("")
        setBio("")
        setSelectedRoles([])
        setTeamMembers([])
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
        <Label htmlFor="user-name">Full name</Label>
        <Input
          id="user-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Daichi Yamamoto"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="user-email">Email</Label>
        <Input
          id="user-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="operator@yamato.io"
          required
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="user-password">Password</Label>
          <Input
            id="user-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isEditing ? "Leave blank to keep the current password" : "At least 6 characters"}
            minLength={isEditing ? undefined : 6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-phone">Phone</Label>
          <Input
            id="user-phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+81 55 123 4567"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="user-bio">Profile note</Label>
        <Textarea
          id="user-bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Add an on-call rotation note or call sign."
          rows={3}
        />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Roles</p>
          <p className="text-sm text-muted-foreground">Toggle the capabilities this operator should inherit.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {roleOptions.map((role) => (
            <label key={role.id} className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
              <Checkbox
                checked={selectedRoles.includes(role.id)}
                onCheckedChange={() => toggleRole(role.id)}
                aria-label={`Toggle role ${role.display_name ?? role.name}`}
              />
              <span>
                <span className="block font-medium">{role.display_name ?? role.name}</span>
                <span className="text-xs text-muted-foreground">ID: {role.id}</span>
              </span>
            </label>
          ))}
          {roleOptions.length === 0 && (
            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              No roles available yet. Create one first from the <Link href="/private/roles/add-edit" className="underline">roles console</Link>.
            </p>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Team assignments</p>
          <p className="text-sm text-muted-foreground">Specify which squads the operator belongs to and their duty.</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-28 space-y-2">
            <Label htmlFor="team-id">Team ID</Label>
            <Input
              id="team-id"
              value={teamIdInput}
              onChange={(event) => setTeamIdInput(event.target.value)}
              placeholder="17"
            />
          </div>
          <div className="min-w-[12rem] flex-1 space-y-2">
            <Label htmlFor="team-role">Duty</Label>
            <Input
              id="team-role"
              value={teamRoleInput}
              onChange={(event) => setTeamRoleInput(event.target.value)}
              placeholder="Incident commander"
            />
          </div>
          <Button type="button" onClick={handleAddTeam}>
            Add assignment
          </Button>
        </div>
        {teamMembers.length > 0 ? (
          <ul className="space-y-2">
            {teamMembers.map((team) => (
              <li key={team.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span>
                  {teamOptions.find((candidate) => candidate.id === team.id)?.name ?? `Team #${team.id}`} · {team.role}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveTeam(team.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            No team assignments yet. Add as many squads as needed or leave them empty for now.
          </p>
        )}
      </div>
      {formError && <p className="text-sm text-red-500">{formError}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          setName(activeUser?.name ?? "")
          setEmail(activeUser?.email ?? "")
          setPassword("")
          setPhone(activeUser?.profile?.phone ?? "")
          setBio(activeUser?.profile?.name ?? "")
          setSelectedRoles(activeUser ? activeUser.roles.map((role) => role.id) : [])
          setTeamMembers(activeUser ? activeUser.teams.map((team) => ({ id: team.id, role: team.role })) : [])
          setFormError(null)
        }}>
          Reset
        </Button>
        <Button type="submit">{isEditing ? "Update user" : "Create user"}</Button>
      </div>
    </form>
  )
}
