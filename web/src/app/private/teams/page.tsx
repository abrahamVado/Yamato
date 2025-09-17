import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Shell from "@/components/secure/shell"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <Card><CardHeader><CardTitle>Teams</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Team membership and ownership.</p></CardContent></Card>
      </div>
    </Shell>
  )
}
