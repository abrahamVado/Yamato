"use client"

//1.- Import cards and badges to display Yamato's security analytics slices.
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const alerts = [
  {
    title: "Policy drift detected",
    detail: "Tokyo cluster drifted from baseline zero-trust posture by 2 delta points.",
    severity: "critical",
  },
  {
    title: "New device enrolled",
    detail: "Commander profile added a hardware key synced with bridge inventory.",
    severity: "info",
  },
  {
    title: "Runbook escalation",
    detail: "Navigator triggered an automated failover that escalated to the Osaka guild.",
    severity: "warning",
  },
]

export function SecurityInsights() {
  //2.- Map severity levels to accent colors for quick scanning.
  const severityTone: Record<string, string> = {
    critical: "bg-red-500/10 text-red-400",
    warning: "bg-amber-500/10 text-amber-400",
    info: "bg-sky-500/10 text-sky-400",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security command center</CardTitle>
        <CardDescription>Review live posture insights before the Yamato SOC escalates.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {alerts.map((alert) => (
          <div key={alert.title} className="grid gap-3 rounded-xl border border-muted/60 bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{alert.title}</h3>
              <Badge className={severityTone[alert.severity]}>{alert.severity}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.detail}</p>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Yamato continually learns from telemetry to highlight meaningful actions for your response crews.
        </p>
      </CardContent>
    </Card>
  )
}
