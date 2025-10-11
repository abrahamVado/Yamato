import Shell from "@/components/secure/shell"
import { AdminUserForm } from "@/components/secure/users/AdminUserForm"

type PageProps = {
  searchParams?: {
    id?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  //1.- Decode the search params to determine whether the form should hydrate in edit mode.
  const parsedId = searchParams?.id ? Number(searchParams.id) : undefined
  const userId = Number.isFinite(parsedId) ? Number(parsedId) : undefined

  return (
    <Shell>
      <div className="grid gap-6">
        <AdminUserForm userId={userId} />
      </div>
    </Shell>
  )
}
