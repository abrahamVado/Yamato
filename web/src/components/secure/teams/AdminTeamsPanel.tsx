"use client"

//1.- Render an administrative cockpit to monitor and seed Yamato teams.
import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useAdminResource } from "@/hooks/use-admin-resource"
import { adminTeamSchema } from "@/lib/validation/admin"

type TeamMember = {
  id: number
  role: string
  name?: string
}

type AdminTeam = {
  id: number
  name: string
  description?: string
  members: TeamMember[]
}

export default function AdminTeamsPanel() {
  const { items, isLoading, error, create, refresh } = useAdminResource<AdminTeam>("admin/teams")

  //2.- Detect when the dataset is empty so we can display a friendly onboarding message.
  const hasTeams = useMemo(() => items.length > 0, [items.length])

  async function handleSeedTeam() {
    //3.- Create a deterministic payload and let Zod guarantee the shape before sending it to the API.
    const timestamp = Date.now()
    const payload = adminTeamSchema.parse({
      name: `Crew ${timestamp}`,
      description: "Exploratory operations squad seeded locally",
      members: [
        {
          id: timestamp,
          role: "Lead navigator",
        },
      ],
    })
    await create(payload, {
      optimistic: {
        id: timestamp,
        name: payload.name,
        description: payload.description,
        members:
          payload.members?.map((member) => ({
            ...member,
            name: member.name ?? `Operator ${member.id}`,
          })) ?? [],
      },
    })
  }

  //4.- Present the table view with actionable headers and contextual help.
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Teams</h2>
          <p className="text-sm text-muted-foreground">
            Map crews to their mission patches and see who is available for new runs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={refresh}>
            Refresh
          </Button>
          <Button type="button" onClick={handleSeedTeam}>
            Seed team
          </Button>
          <Button asChild variant="secondary">
            <Link href="/private/teams/add-edit">Add team</Link>
          </Button>
        </div>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading teams…</p>}
      {error && <p className="text-sm text-red-500">Failed to load teams: {(error as Error).message}</p>}
      {!isLoading && !error && !hasTeams ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          No squads available yet. Seed a team to preview the layout or create one with your real operators.
        </div>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Team</th>
              <th>Description</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {items.map((team) => (
              <tr key={team.id} className="border-b last:border-0">
                <td className="py-2 font-medium">{team.name}</td>
                <td>{team.description || "—"}</td>
                <td>
                  {team.members.length > 0
                    ? team.members.map((member) => member.name ?? `#${member.id} (${member.role})`).join(", ")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
