import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Shell from "@/components/secure/shell"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <Card><CardHeader><CardTitle>My Profile</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Update name, email, password, 2FA.</p></CardContent></Card>
      </div>
    </Shell>
  )
}
