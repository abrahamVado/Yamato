import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Shell from "@/components/secure/shell"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <Card><CardHeader><CardTitle>Modules</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Enable/disable product modules per tenant.</p></CardContent></Card>
      </div>
    </Shell>
  )
}
