"use client"

//1.- Import cards to wrap the existing admin user panel with additional storytelling content.
import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function UsersDirectory({ panel }: { panel: ReactNode }) {
  //2.- Surround the raw table with onboarding copy and quick actions.
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Operator directory</CardTitle>
          <CardDescription>Invite new crews, suspend rogue accounts and sync with identity providers.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline">
            Bulk invite
          </Button>
          <Button type="button">Create operator</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Yamato mirrors SCIM payloads but lets you preview permissions locally before the push goes live.
        </p>
        {panel}
      </CardContent>
    </Card>
  )
}
