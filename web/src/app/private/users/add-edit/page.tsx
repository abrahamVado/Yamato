import Shell from "@/components/secure/shell"
import { AdminUserForm } from "@/components/secure/users/AdminUserForm"
import { PrivateNeumorphicShell } from "@/components/views/private/PrivateNeumorphicShell"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

type PageProps = {
  searchParams?: {
    id?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  //1.- Decode the search params to determine whether the form should hydrate in edit mode.
  const parsedId = searchParams?.id ? Number(searchParams.id) : undefined
  const userId = Number.isFinite(parsedId) ? Number(parsedId) : undefined

  //2.- Surface a contextual header so operators see whether they are creating or editing a user.
  const layoutTitle = userId ? "Edit user" : "Create user"

  //3.- Render the secure shell with the private layout to align with the rest of the workspace headers.
  //4.- Surround the form with the neumorphic shell so editing stays visually consistent with other private views.
  return (
    <Shell>
      <PrivateViewLayout title={layoutTitle}>
        <PrivateNeumorphicShell testId="users-add-edit-neumorphic-shell">
          <AdminUserForm userId={userId} />
        </PrivateNeumorphicShell>
      </PrivateViewLayout>
    </Shell>
  )
}
