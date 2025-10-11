import Shell from "@/components/secure/shell"
import { AdminTeamForm } from "@/components/secure/teams/AdminTeamForm"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

type PageProps = {
  searchParams?: {
    id?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  //1.- Convert the incoming query string into an optional numeric identifier for edit scenarios.
  const parsedId = searchParams?.id ? Number(searchParams.id) : undefined
  const teamId = Number.isFinite(parsedId) ? Number(parsedId) : undefined

  //2.- Toggle the header language so teammates know if they are creating a fresh team or editing an existing one.
  const layoutTitle = teamId ? "Edit team" : "Create team"

  //3.- Render the shared shell and private layout to display the new contextual heading.
  return (
    <Shell>
      <PrivateViewLayout title={layoutTitle}>
        <AdminTeamForm teamId={teamId} />
      </PrivateViewLayout>
    </Shell>
  )
}
