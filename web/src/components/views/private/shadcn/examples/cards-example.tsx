"use client"

//1.- Import card primitives and supporting inputs to compose a gallery of card layouts.
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export function CardsExample() {
  //2.- Mirror the cards page by arranging varied card compositions across a responsive grid.
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Start a new workspace in seconds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team name</Label>
            <Input id="team-name" placeholder="Acme Inc" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-url">Team URL</Label>
            <Input id="team-url" placeholder="acme.yamato.dev" />
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium">Secure invite links</p>
              <p className="text-xs text-muted-foreground">Expire after 24 hours by default.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create workspace</Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Payment method</CardTitle>
          <CardDescription>Update the default billing profile for your org.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-name">Name on card</Label>
            <Input id="card-name" placeholder="Olivia Martin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-number">Card number</Label>
            <Input id="card-number" placeholder="4242 4242 4242 4242" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry</Label>
              <Input id="expiry" placeholder="12 / 28" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Team members</CardTitle>
            <CardDescription>Invite collaborators and assign roles.</CardDescription>
          </div>
          <Badge variant="secondary">7 members</Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Floyd Miles</p>
              <p className="text-muted-foreground">Owner</p>
            </div>
            <Button variant="ghost" size="sm">
              Manage
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Jenny Wilson</p>
              <p className="text-muted-foreground">Admin</p>
            </div>
            <Button variant="ghost" size="sm">
              Manage
            </Button>
          </div>
          <div className="rounded-lg border border-dashed p-3 text-center text-muted-foreground">
            Invite teammates to collaborate securely.
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Share document</CardTitle>
          <CardDescription>Generate a one-time share link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doc-email">Recipient email</Label>
            <Input id="doc-email" placeholder="ceo@acme.co" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-message">Message</Label>
            <Textarea id="doc-message" placeholder="Let me know if you have questions." />
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium">Require passcode</p>
              <p className="text-xs text-muted-foreground">The code is sent separately via SMS.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Copy link</Button>
          <Button>Share securely</Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Notification summary</CardTitle>
          <CardDescription>Digest of automation highlights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-lg border bg-background p-3 shadow-sm">
            <p className="font-medium">Policy Mesh synced</p>
            <p className="text-muted-foreground">12 new enforcement regions applied.</p>
          </div>
          <div className="rounded-lg border bg-background p-3 shadow-sm">
            <p className="font-medium">Runbook draft approved</p>
            <p className="text-muted-foreground">Billing guardrails ready for launch.</p>
          </div>
          <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-center text-muted-foreground">
            Quiet hours enabled · All set!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
