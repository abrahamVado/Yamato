"use client"

//1.- Import localization, icons, and UI primitives to stage the exploratory map canvas.
import { useI18n } from "@/app/providers/I18nProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HiMiniMap, HiMiniBolt, HiMiniArrowPath, HiMiniGlobeAmericas } from "react-icons/hi2"

// Helper type for the localized layer dataset
interface LayerEntry {
  title: string
  description: string
  metric: string
  value: string
  trend: string
}

export function MapExplorerView() {
  //2.- Pull localized copy for headings and layer metadata so the canvas respects the active locale.
  const { t, dict } = useI18n()
  const layers = (dict.private?.map?.layers ?? []) as LayerEntry[]

  //3.- Render the hero map visualization alongside contextual layer summaries and quick actions.
  return (
    <Card className="overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HiMiniMap className="h-6 w-6" />
          </span>
          <div>
            <CardTitle className="text-2xl">{t("private.map.title")}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {t("private.map.subtitle")}
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <HiMiniArrowPath className="h-4 w-4" />
            {t("private.map.actions.refresh")}
          </Button>
          <Button className="gap-2">
            <HiMiniBolt className="h-4 w-4" />
            {t("private.map.actions.optimize")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-muted/40 p-6 dark:bg-muted/20">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 opacity-70" />
          <div className="relative grid gap-4">
            <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <HiMiniGlobeAmericas className="h-5 w-5 text-primary" />
                {t("private.map.actions.optimize")}
              </span>
              <span className="rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                {t("private.map.actions.refresh")}
              </span>
            </div>
            <div className="grid h-64 place-items-center rounded-xl bg-background/80 text-center shadow-inner">
              <p className="max-w-sm text-sm text-muted-foreground">
                {t("private.map.subtitle")}
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {layers.map((layer, index) => (
            <div
              key={layer.title}
              className="grid gap-2 rounded-xl border border-muted/60 bg-muted/20 p-4 dark:border-muted/40 dark:bg-muted/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {index + 1}. {layer.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{layer.description}</p>
                </div>
                <span className="rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  {layer.metric}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{layer.value}</span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {layer.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
