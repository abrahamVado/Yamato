"use client"

//1.- Compose a multi-step form showcasing different control types.
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export function FormsExample() {
  //2.- Use native selects styled with Tailwind to avoid extra dependencies while staying on brand.
  return (
    <Card>
      <CardHeader>
        <CardTitle>Support request</CardTitle>
        <CardDescription>Collect structured info to triage enterprise tickets.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jenny Wilson" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="support@acme.co" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            defaultValue="p1"
          >
            <option value="p0">P0 · Critical outage</option>
            <option value="p1">P1 · Major degradation</option>
            <option value="p2">P2 · Minor bug</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Share context, repro steps and the impact radius."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="environment">Environment</Label>
          <select
            id="environment"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            defaultValue="staging"
          >
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="dev">Development</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="attachments">Attachments</Label>
          <Input id="attachments" type="file" multiple />
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-sm">
            <span>Escalate to on-call immediately</span>
            <Switch defaultChecked />
          </label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Save draft</Button>
        <Button>Submit ticket</Button>
      </CardFooter>
    </Card>
  )
}
