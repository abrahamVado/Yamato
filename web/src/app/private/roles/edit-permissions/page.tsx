import Shell from "@/components/secure/shell"
import { RolePermissionsForm } from "@/components/secure/roles/RolePermissionsForm"
import { PrivateNeumorphicShell } from "@/components/views/private/PrivateNeumorphicShell"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Render the secure workspace with the permission editor embedded.
  //2.- Use the private layout to announce the permission editing context with a consistent header.
  //3.- Encapsulate the permissions form in the neumorphic shell to mirror other private edit experiences.
  return (
    <Shell>
      <PrivateViewLayout title="Edit permissions">
        <PrivateNeumorphicShell testId="permissions-edit-neumorphic-shell">
          <RolePermissionsForm />
        </PrivateNeumorphicShell>
      </PrivateViewLayout>
    </Shell>
  )
}
