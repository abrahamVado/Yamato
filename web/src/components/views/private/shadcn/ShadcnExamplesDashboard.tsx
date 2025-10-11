"use client"

//1.- Import the shared admin shell pieces plus the utility components used across every example tab.
import { ContentLayout } from "@/components/admin-panel/content-layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { PrivateNeumorphicShell } from "../PrivateNeumorphicShell"

//2.- Pull in the concrete example canvases that mirror the shadcn/ui marketing examples.
import { DashboardExample } from "./examples/dashboard-example"
import { CardsExample } from "./examples/cards-example"
import { TasksExample } from "./examples/tasks-example"
import { MusicExample } from "./examples/music-example"
import { PlaygroundExample } from "./examples/playground-example"
import { AuthExample } from "./examples/auth-example"
import { FormsExample } from "./examples/forms-example"
import { MailExample } from "./examples/mail-example"

export type DashboardExamplesProps = {
  //3.- Receive sidebar configuration so we can surface the global toggles inside the gallery header.
  isHoverOpen: boolean
  isSidebarDisabled: boolean
  onToggleHover: (value: boolean) => void
  onToggleSidebar: (value: boolean) => void
}

export function ShadcnExamplesDashboard({
  isHoverOpen,
  isSidebarDisabled,
  onToggleHover,
  onToggleSidebar,
}: DashboardExamplesProps) {
  //4.- Render the admin layout breadcrumb plus a hero describing how to explore the curated examples.
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
            <BreadcrumbPage>Dashboard examples</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/*5.- Center the gallery using the shared neumorphic shell so the private dashboard mirrors the docs treatment.*/}
      <PrivateNeumorphicShell testId="dashboard-neumorphic-card" wrapperClassName="mt-6">
        <section className="space-y-6">
            <Card className="border-dashed bg-muted/40 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary" className="rounded-full">Shadcn showcase</Badge>
                  <h1 className="text-2xl font-semibold tracking-tight">All official ui.shadcn.com examples in one dashboard</h1>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Toggle through each tab to review the reference implementations for dashboard, cards, tasks, music, playground,
                    authentication, forms, and mail experiences. The controls on the right interact with the shell so you can demo hover
                    navigation and compact layouts.
                  </p>
                </div>
                <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="hover-toggle" className="text-sm text-muted-foreground">
                      Hover open sidebar
                    </Label>
                    <Switch id="hover-toggle" checked={isHoverOpen} onCheckedChange={onToggleHover} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="disable-toggle" className="text-sm text-muted-foreground">
                      Disable sidebar
                    </Label>
                    <Switch id="disable-toggle" checked={isSidebarDisabled} onCheckedChange={onToggleSidebar} />
                  </div>
                </div>
              </div>
            </Card>

            {/*6.- Tabs let stakeholders browse every shadcn example without leaving the private dashboard route.*/}
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-transparent p-0 text-muted-foreground">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-background">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="cards" className="data-[state=active]:bg-background">
                  Cards
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-background">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="music" className="data-[state=active]:bg-background">
                  Music
                </TabsTrigger>
                <TabsTrigger value="playground" className="data-[state=active]:bg-background">
                  Playground
                </TabsTrigger>
                <TabsTrigger value="auth" className="data-[state=active]:bg-background">
                  Authentication
                </TabsTrigger>
                <TabsTrigger value="forms" className="data-[state=active]:bg-background">
                  Forms
                </TabsTrigger>
                <TabsTrigger value="mail" className="data-[state=active]:bg-background">
                  Mail
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <DashboardExample />
              </TabsContent>
              <TabsContent value="cards" className="space-y-6">
                <CardsExample />
              </TabsContent>
              <TabsContent value="tasks" className="space-y-6">
                <TasksExample />
              </TabsContent>
              <TabsContent value="music" className="space-y-6">
                <MusicExample />
              </TabsContent>
              <TabsContent value="playground" className="space-y-6">
                <PlaygroundExample />
              </TabsContent>
              <TabsContent value="auth" className="space-y-6">
                <AuthExample />
              </TabsContent>
              <TabsContent value="forms" className="space-y-6">
                <FormsExample />
              </TabsContent>
              <TabsContent value="mail" className="space-y-6">
                <MailExample />
              </TabsContent>
            </Tabs>
        </section>
      </PrivateNeumorphicShell>
    </ContentLayout>
  )
}
