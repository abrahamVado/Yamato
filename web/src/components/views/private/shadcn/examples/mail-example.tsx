"use client"

//1.- Model the mail client with folders, list and preview panes.
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const folders = [
  { name: "Inbox", count: 12 },
  { name: "Starred", count: 3 },
  { name: "Automation", count: 5 },
  { name: "Drafts", count: 2 },
]

const messages = [
  {
    id: "1",
    sender: "Runbook Copilot",
    subject: "Incident 231 • Resolved",
    preview: "Autopilot closed the incident with 98% confidence...",
    time: "2h ago",
  },
  {
    id: "2",
    sender: "Billing Mesh",
    subject: "Sync complete",
    preview: "All tenant guardrails have been updated.",
    time: "4h ago",
  },
  {
    id: "3",
    sender: "Operations",
    subject: "Weekly digest",
    preview: "Highlights from automation and compliance teams.",
    time: "Yesterday",
  },
]

export function MailExample() {
  //2.- Use a responsive grid so the folder column collapses on small viewports like the shadcn example.
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Mail</CardTitle>
          <CardDescription>Review automation notifications and human approvals.</CardDescription>
        </div>
        <Button>Compose</Button>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[220px_1fr_2fr]">
        <div className="space-y-3">
          {folders.map((folder) => (
            <Button
              key={folder.name}
              variant={folder.name === "Inbox" ? "secondary" : "ghost"}
              className="w-full justify-between"
            >
              <span>{folder.name}</span>
              <Badge variant="outline">{folder.count}</Badge>
            </Button>
          ))}
        </div>
        <ScrollArea className="h-[360px] rounded-lg border">
          <div className="divide-y">
            {messages.map((message) => (
              <button
                key={message.id}
                className="flex w-full flex-col gap-1 p-4 text-left transition hover:bg-muted/50"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{message.sender}</span>
                  <span className="text-muted-foreground">{message.time}</span>
                </div>
                <p className="text-sm">{message.subject}</p>
                <p className="text-xs text-muted-foreground">{message.preview}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="hidden flex-col space-y-4 rounded-lg border bg-muted/20 p-6 lg:flex">
          <div>
            <h3 className="text-lg font-semibold">Incident 231 • Resolved</h3>
            <p className="text-sm text-muted-foreground">Autopilot closed the incident with 98% confidence.</p>
          </div>
          <div className="space-y-3 text-sm">
            <p>Hi Olivia,</p>
            <p>
              Policy Mesh propagated the billing fix across affected tenants. No manual follow-up is required, but the log has
              been attached for your review.
            </p>
            <p className="text-muted-foreground">Cheers, Runbook Copilot</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm">Reply</Button>
            <Button variant="outline" size="sm">
              Forward
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
