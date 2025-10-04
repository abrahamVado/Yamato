"use client"

//1.- Import controls to build a settings cockpit with toggles and descriptive copy.
import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function SettingsControlPanel() {
  //2.- Stage local toggles to visualize how org-wide settings might be flipped.
  const [settings, setSettings] = React.useState({
    billingAlerts: true,
    maintenanceWindow: false,
    aiAssistance: true,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization preferences</CardTitle>
        <CardDescription>Prototype how Yamato propagates platform-wide switches across tenants.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <label className="flex items-center justify-between gap-4 rounded-lg border border-muted/60 bg-muted/20 p-4">
          <div>
            <p className="font-medium">Billing alerts</p>
            <p className="text-sm text-muted-foreground">Email finance teams before usage exceeds committed spend.</p>
          </div>
          <Switch
            checked={settings.billingAlerts}
            onCheckedChange={(value) => setSettings((prev) => ({ ...prev, billingAlerts: Boolean(value) }))}
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-lg border border-muted/60 bg-muted/20 p-4">
          <div>
            <p className="font-medium">Maintenance window</p>
            <p className="text-sm text-muted-foreground">Pause automation pushes during regional maintenance.</p>
          </div>
          <Switch
            checked={settings.maintenanceWindow}
            onCheckedChange={(value) => setSettings((prev) => ({ ...prev, maintenanceWindow: Boolean(value) }))}
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-lg border border-muted/60 bg-muted/20 p-4">
          <div>
            <p className="font-medium">AI assistance</p>
            <p className="text-sm text-muted-foreground">Allow copilots to draft runbooks and respond to incidents.</p>
          </div>
          <Switch
            checked={settings.aiAssistance}
            onCheckedChange={(value) => setSettings((prev) => ({ ...prev, aiAssistance: Boolean(value) }))}
          />
        </label>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Yamato stores staged settings locally until you publish changes to all data centers.
        </p>
        <Button type="button">Publish to fleets</Button>
      </CardFooter>
    </Card>
  )
}
