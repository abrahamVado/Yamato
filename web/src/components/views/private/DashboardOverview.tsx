"use client"

//1.- Import the admin layout primitives and rich UI elements used to compose the dashboard canvas.
import Link from "next/link"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DashboardOverviewProps = {
  //2.- Receive the sidebar state toggles so the page container can control the layout settings store.
  isHoverOpen: boolean
  isSidebarDisabled: boolean
  onToggleHover: (value: boolean) => void
  onToggleSidebar: (value: boolean) => void
}

const trendline = [
  { month: "Jan", velocity: 38 },
  { month: "Feb", velocity: 42 },
  { month: "Mar", velocity: 47 },
  { month: "Apr", velocity: 53 },
  { month: "May", velocity: 61 },
  { month: "Jun", velocity: 68 },
]

const lighthouse = [
  { label: "Signals trained", value: "127" },
  { label: "Policies synced", value: "38" },
  { label: "Incidents automated", value: "92%" },
]

export function DashboardOverview({
  isHoverOpen,
  isSidebarDisabled,
  onToggleHover,
  onToggleSidebar,
}: DashboardOverviewProps) {
  //3.- Render the navigation breadcrumb alongside toggles controlling the shell experience.
  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">Velocity overview</CardTitle>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Yamato estimates your automation runway based on ingest volume, policy drift and compliance thresholds.
              </p>
            </div>
            <TooltipProvider>
              <div className="flex gap-5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Switch id="hover-open" checked={isHoverOpen} onCheckedChange={onToggleHover} />
                      <Label htmlFor="hover-open">Hover open</Label>
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>Peek the navigation while you plan rollouts.</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Switch id="disable-sidebar" checked={isSidebarDisabled} onCheckedChange={onToggleSidebar} />
                      <Label htmlFor="disable-sidebar">Disable sidebar</Label>
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>Perfect for focused war rooms and demos.</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendline}>
                <CartesianGrid strokeDasharray="4 8" className="stroke-muted" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <RechartsTooltip cursor={{ strokeDasharray: "4 4" }} contentStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="velocity" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.35)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operator lighthouse</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {lighthouse.map((item) => (
              <div key={item.label} className="rounded-lg border border-muted bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent command timeline</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          {/* 4.- Provide fictional telemetry events to help stakeholders imagine the system in action. */}
          <div className="grid gap-1 rounded-lg border border-muted/60 bg-muted/20 p-4">
            <p className="font-medium text-foreground">11:02 • Policy Mesh sync</p>
            <p>
              Edge clusters pulled the latest runtime guardrails from Tokyo, applying them across 6 global tenants in 24
              seconds.
            </p>
          </div>
          <div className="grid gap-1 rounded-lg border border-muted/60 bg-muted/20 p-4">
            <p className="font-medium text-foreground">09:48 • Runbook autopilot</p>
            <p>
              AI identified repeating billing drifts and launched an automated remediation sprint with human oversight at
              3%.
            </p>
          </div>
          <div className="grid gap-1 rounded-lg border border-muted/60 bg-muted/20 p-4">
            <p className="font-medium text-foreground">07:16 • Bridge handshake</p>
            <p>On-call commander acknowledged a zero-trust handshake with the third-party logistics uplink.</p>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  )
}
