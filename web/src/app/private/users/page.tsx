import Shell from "@/components/secure/shell"
import AdminUsersPanel from "@/components/secure/users/AdminUsersPanel"
import { UsersDirectory } from "@/components/views/private/UsersDirectory"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <UsersDirectory panel={<AdminUsersPanel />} />
      </div>
    </Shell>
  )
}
