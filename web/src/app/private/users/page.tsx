import Shell from "@/components/secure/shell"
import AdminUsersPanel from "@/components/secure/users/AdminUsersPanel"
import { UsersDirectory } from "@/components/views/private/UsersDirectory"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Preserve the loading guard while surfacing the shared header treatment for the users directory.
  return (
    <Shell>
      {/*2.- Feed the Users title into the layout so the navbar mirrors the dashboard header.*/}
      <PrivateViewLayout title="Users">
        {/*3.- Render the directory and admin controls together inside the grid container.*/}
        <UsersDirectory panel={<AdminUsersPanel />} />
      </PrivateViewLayout>
    </Shell>
  )
}
