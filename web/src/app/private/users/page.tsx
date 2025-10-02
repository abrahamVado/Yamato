import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Shell from "@/components/secure/shell"
import AdminUsersPanel from "@/components/secure/users/AdminUsersPanel"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">List, invite, suspend. Permissions-aware.</p>
            <AdminUsersPanel />
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
