"use client"

//1.- Import UI primitives that help illustrate a rich operator profile experience.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ProfileShowcase() {
  //2.- Capture a fictional operator persona with trust scores for the animated progress bars.
  const persona = {
    name: "Mika Tanaka",
    role: "Chief Operator",
    squad: "Tokyo bridge",
    badges: ["Zero-trust", "Runbook author", "SRE guild"],
    trust: {
      mfa: 100,
      recovery: 92,
      compliance: 86,
    },
  }

  //3.- Present the persona card alongside actionable security reminders.
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Operator identity</CardTitle>
          <CardDescription>Keep personal details fresh to unlock Yamato's automation copilots.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <p className="text-2xl font-semibold">{persona.name}</p>
            <p className="text-sm text-muted-foreground">{persona.role}</p>
            <div className="flex flex-wrap gap-2">
              {persona.badges.map((badge) => (
                <Badge key={badge} variant="outline" className="uppercase tracking-widest">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Multi-factor</h3>
              <Progress value={persona.trust.mfa} />
              <p className="mt-2 text-xs text-muted-foreground">
                Security keys confirmed for Yamato, Okta and PagerDuty with fallbacks rotated last week.
              </p>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Account recovery</h3>
              <Progress value={persona.trust.recovery} />
              <p className="mt-2 text-xs text-muted-foreground">
                Backup channels span SMS, voice bridge and offline codes vaulted in the SOC war room.
              </p>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Compliance alignment</h3>
              <Progress value={persona.trust.compliance} />
              <p className="mt-2 text-xs text-muted-foreground">
                Required attestations for ISO 27001 and SOC 2 submitted with cryptographic proofs.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next best actions</CardTitle>
          <CardDescription>Yamato suggests routine hygiene tasks to keep the cockpit pristine.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div className="rounded-lg border border-muted/60 bg-muted/20 p-4">
            Rotate the bridge password vault. Operators should run the "Seafaring seals" protocol weekly.
          </div>
          <div className="rounded-lg border border-muted/60 bg-muted/20 p-4">
            Approve two pending runbook edits authored by the Osaka guild to roll out predictive failover.
          </div>
          <div className="rounded-lg border border-muted/60 bg-muted/20 p-4">
            Export an encrypted copy of the audit log to archive 2024 Q1 operations.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
