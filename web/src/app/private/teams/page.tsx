import Shell from "@/components/secure/shell"
import AdminTeamsPanel from "@/components/secure/teams/AdminTeamsPanel"
import { TeamsOverview } from "@/components/views/private/TeamsOverview"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Retain the secure shell gating while introducing the consistent header seen on the dashboard.
  return (
    <Shell>
      {/*2.- Label the view via the shared layout so the Teams navbar title appears across private screens.*/}
      <PrivateViewLayout title="Teams">
        {/*3.- Render both the overview and admin panel inside the layout grid to maintain vertical rhythm.*/}
        <TeamsOverview />
        <AdminTeamsPanel />
      </PrivateViewLayout>
    </Shell>
  )
}
