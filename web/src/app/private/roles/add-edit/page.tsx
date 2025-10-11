import Shell from "@/components/secure/shell"
import { AdminRoleForm } from "@/components/secure/roles/AdminRoleForm"

type PageProps = {
  searchParams?: {
    id?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  //1.- Interpret optional ids from the query string to hydrate the form for editing.
  const parsedId = searchParams?.id ? Number(searchParams.id) : undefined
  const roleId = Number.isFinite(parsedId) ? Number(parsedId) : undefined

  return (
    <Shell>
      <div className="grid gap-6">
        <AdminRoleForm roleId={roleId} />
      </div>
    </Shell>
  )
}
