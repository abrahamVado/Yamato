"use client"

//1.- Provide a reusable form to create or update Yamato teams with optimistic UX.
import { FormEvent, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdminResource } from "@/hooks/use-admin-resource"
import { adminTeamSchema } from "@/lib/validation/admin"
import type { AdminTeam, TeamMember } from "./team-types"

type AdminTeamFormProps = {
  teamId?: number
}

export function AdminTeamForm({ teamId }: AdminTeamFormProps) {
  const { items, create, update } = useAdminResource<AdminTeam>("admin/teams")

  //2.- Locate the active record so editing routes populate existing values automatically.
  const activeTeam = useMemo(() => items.find((team) => team.id === teamId), [items, teamId])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [members, setMembers] = useState<TeamMember[]>([])
  const [memberIdInput, setMemberIdInput] = useState("")
  const [memberRoleInput, setMemberRoleInput] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const isEditing = Boolean(teamId && activeTeam)

  useEffect(() => {
    //3.- Synchronize local state whenever the active record changes.
    if (!activeTeam) {
      setName("")
      setDescription("")
      setMembers([])
      return
    }
    setName(activeTeam.name)
    setDescription(activeTeam.description ?? "")
    setMembers(activeTeam.members ?? [])
  }, [activeTeam])

  //4.- Validate roster entries before pushing them into state.
  function handleAddMember() {
    const numericId = Number(memberIdInput)
    if (!numericId || Number.isNaN(numericId)) {
      setFormError("Enter a valid numeric member id before adding them to the roster.")
      return
    }
    const trimmedRole = memberRoleInput.trim() || "Member"
    setMembers((current) => [
      ...current,
      {
        id: numericId,
        role: trimmedRole,
      },
    ])
    setMemberIdInput("")
    setMemberRoleInput("")
    setFormError(null)
  }

  function handleRemoveMember(id: number) {
    //5.- Allow operators to remove roster entries inline before saving.
    setMembers((current) => current.filter((member) => member.id !== id))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const payload = adminTeamSchema.parse({
        name: name.trim(),
        description: description.trim() || undefined,
        members: members.map((member) => ({
          id: member.id,
          role: member.role,
          name: member.name?.trim() || undefined,
        })),
      })
      if (isEditing && teamId) {
        //6.- Send a PATCH for existing squads and update the optimistic cache entry.
        await update(teamId, payload, {
          optimistic: {
            id: teamId,
            name: payload.name,
            description: payload.description,
            members: members,
          },
        })
      } else {
        const timestamp = Date.now()
        //7.- Issue a POST for new squads and append the freshly crafted roster.
        await create(payload, {
          optimistic: {
            id: timestamp,
            name: payload.name,
            description: payload.description,
            members: members,
          },
        })
        setName("")
        setDescription("")
        setMembers([])
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
        <Label htmlFor="team-name">Team name</Label>
        <Input
          id="team-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Orbital Support"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="team-description">Mission description</Label>
        <Textarea
          id="team-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe responsibilities and escalation paths"
          rows={3}
        />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Roster</p>
          <p className="text-sm text-muted-foreground">
            Use the quick add controls to map existing operators into this crew.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-28 space-y-2">
            <Label htmlFor="member-id">User ID</Label>
            <Input
              id="member-id"
              value={memberIdInput}
              onChange={(event) => setMemberIdInput(event.target.value)}
              placeholder="42"
            />
          </div>
          <div className="min-w-[12rem] flex-1 space-y-2">
            <Label htmlFor="member-role">Role</Label>
            <Input
              id="member-role"
              value={memberRoleInput}
              onChange={(event) => setMemberRoleInput(event.target.value)}
              placeholder="Responder"
            />
          </div>
          <Button type="button" onClick={handleAddMember}>
            Add member
          </Button>
        </div>
        {members.length > 0 ? (
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span>
                  #{member.id} · {member.role}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            No roster entries yet. Add at least one operator or leave the team empty for now.
          </p>
        )}
      </div>
      {formError && <p className="text-sm text-red-500">{formError}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          setName(activeTeam?.name ?? "")
          setDescription(activeTeam?.description ?? "")
          setMembers(activeTeam?.members ?? [])
          setFormError(null)
        }}>
          Reset
        </Button>
        <Button type="submit">{isEditing ? "Update team" : "Create team"}</Button>
      </div>
    </form>
  )
}
