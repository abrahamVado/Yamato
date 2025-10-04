"use client"

//1.- Import UI helpers to render the permissions matrix for Yamato roles.
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const roles = [
  {
    name: "Commander",
    summary: "Full control across modules, billing, deployments and tenant policy",
    permissions: ["Modules", "Billing", "Runbooks", "Audit log"],
  },
  {
    name: "Navigator",
    summary: "Daily operator who monitors signals, triages incidents and approves workflows",
    permissions: ["Signals", "Incidents", "Automation"],
  },
  {
    name: "Observer",
    summary: "Read-only cockpit with curated dashboards and compliance exports",
    permissions: ["Dashboards", "Exports"],
  },
]

export function RolesMatrix() {
  //2.- Render each role with a quick badge list to spotlight curated capabilities.
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role playbook</CardTitle>
        <CardDescription>Define which crews can change modules, deploy automations or observe telemetry.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {roles.map((role) => (
          <div key={role.name} className="grid gap-3 rounded-xl border border-muted/60 bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">{role.name}</h3>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="uppercase tracking-widest">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{role.summary}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
