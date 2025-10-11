import Shell from "@/components/secure/shell"
import { RolePermissionsForm } from "@/components/secure/roles/RolePermissionsForm"

export default function Page() {
  //1.- Render the secure workspace with the permission editor embedded.
  return (
    <Shell>
      <div className="grid gap-6">
        <RolePermissionsForm />
      </div>
    </Shell>
  )
}
