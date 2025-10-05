"use client"

//1.- Import translation helpers, UI surfaces, and icons to assemble the spatial command dashboard.
import { useI18n } from "@/app/providers/I18nProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HiMiniPresentationChartBar, HiMiniSignal, HiMiniRocketLaunch } from "react-icons/hi2"

interface WidgetEntry {
  title: string
  value: string
  delta: string
  description: string
}

interface TimelineEntry {
  time: string
  event: string
}

export function MapDashboardView() {
  //2.- Pull the localized widget metrics and timeline annotations so the dashboard is locale-aware.
  const { t, dict } = useI18n()
  const widgets = (dict.private?.mapDashboard?.widgets ?? []) as WidgetEntry[]
  const timeline = (dict.private?.mapDashboard?.timeline ?? []) as TimelineEntry[]

  //3.- Compose the mission dashboard with KPI tiles, sparkline placeholders, and a timeline feed.
  return (
    <div className="grid gap-6">
      <Card className="border border-primary/30 bg-gradient-to-b from-primary/5 via-background to-background">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HiMiniPresentationChartBar className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-2xl">{t("private.mapDashboard.title")}</CardTitle>
              <CardDescription>{t("private.mapDashboard.subtitle")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {widgets.map((widget) => (
            <div key={widget.title} className="rounded-xl border border-muted/60 bg-background/80 p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                  <HiMiniSignal className="h-4 w-4 text-primary" />
                  {widget.title}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {widget.delta}
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{widget.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{widget.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-muted/60 bg-background/80">
        <CardHeader className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HiMiniRocketLaunch className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="text-lg">{t("private.map.title")}</CardTitle>
            <CardDescription>{t("private.map.subtitle")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {timeline.map((entry, index) => (
            <div key={entry.event} className="grid gap-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{entry.time}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{index + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.event}</p>
              {index < timeline.length - 1 && <Separator className="bg-muted/60" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
