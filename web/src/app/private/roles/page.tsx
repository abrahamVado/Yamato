import Shell from "@/components/secure/shell"
import AdminRolesPanel from "@/components/secure/roles/AdminRolesPanel"
import { RolesMatrix } from "@/components/views/private/RolesMatrix"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Maintain the secure shell overlay while introducing the shared header styling for the roles surface.
  return (
    <Shell>
      {/*2.- Provide the Roles title through the reusable layout so the navbar matches the dashboard experience.*/}
      <PrivateViewLayout title="Roles">
        {/*3.- Preserve the twin-column spacing by rendering the matrix and admin panel inside the grid.*/}
        <RolesMatrix />
        <AdminRolesPanel />
      </PrivateViewLayout>
    </Shell>
  )
}
