import Shell from "@/components/secure/shell"
import { AdminTeamForm } from "@/components/secure/teams/AdminTeamForm"

type PageProps = {
  searchParams?: {
    id?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  //1.- Convert the incoming query string into an optional numeric identifier for edit scenarios.
  const parsedId = searchParams?.id ? Number(searchParams.id) : undefined
  const teamId = Number.isFinite(parsedId) ? Number(parsedId) : undefined

  return (
    <Shell>
      <div className="grid gap-6">
        <AdminTeamForm teamId={teamId} />
      </div>
    </Shell>
  )
}
