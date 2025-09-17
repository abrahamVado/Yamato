import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Shell from "@/components/secure/shell"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <Card><CardHeader><CardTitle>Security</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Audit logs, 2FA policy, sessions.</p></CardContent></Card>
      </div>
    </Shell>
  )
}
