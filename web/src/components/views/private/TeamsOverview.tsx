"use client"

//1.- Import UI building blocks to display squad compositions for Yamato teams.
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const teams = [
  {
    name: "Tokyo bridge",
    mission: "Owns real-time orchestration for Asia-Pacific tenants",
    members: ["MT", "HK", "SY"],
  },
  {
    name: "Osaka guild",
    mission: "Authors runbooks and automation heuristics",
    members: ["AN", "KO", "RS"],
  },
  {
    name: "Nagoya observatory",
    mission: "Maintains telemetry pipelines and anomaly detectors",
    members: ["TL", "QA", "OP"],
  },
]

export function TeamsOverview() {
  //2.- Render each team in a card with avatars representing operator initials.
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams cockpit</CardTitle>
        <CardDescription>Review who pilots each stream of work before granting elevated access.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {teams.map((team) => (
          <div key={team.name} className="grid gap-3 rounded-xl border border-muted/60 bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.mission}</p>
              </div>
              <div className="flex -space-x-3">
                {team.members.map((initials) => (
                  <Avatar key={initials} className="border-2 border-background">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
