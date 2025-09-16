import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><CardTitle>Orders <Badge>+18%</Badge></CardTitle></CardHeader><CardContent>…</CardContent></Card>
        <Card><CardHeader><CardTitle>Revenue</CardTitle></CardHeader><CardContent>…</CardContent></Card>
        <Card><CardHeader><CardTitle>Users</CardTitle></CardHeader><CardContent>…</CardContent></Card>
      </div>
    </div>
  )
}
