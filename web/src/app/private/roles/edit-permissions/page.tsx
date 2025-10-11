import Shell from "@/components/secure/shell"
import { RolePermissionsForm } from "@/components/secure/roles/RolePermissionsForm"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Render the secure workspace with the permission editor embedded.
  //2.- Use the private layout to announce the permission editing context with a consistent header.
  return (
    <Shell>
      <PrivateViewLayout title="Edit permissions">
        <RolePermissionsForm />
      </PrivateViewLayout>
    </Shell>
  )
}
