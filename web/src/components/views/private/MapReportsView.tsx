"use client"

//1.- Import localized helpers and icons to present the reporting studio with actionable affordances.
import { useI18n } from "@/app/providers/I18nProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HiMiniDocumentChartBar, HiMiniCloudArrowDown, HiMiniClock } from "react-icons/hi2"

interface ReportEntry {
  title: string
  description: string
  format: string
  status: string
}

export function MapReportsView() {
  //2.- Read translated copy so report metadata, titles, and action buttons reflect the chosen language.
  const { t, dict } = useI18n()
  const reports = (dict.private?.mapReports?.reports ?? []) as ReportEntry[]

  //3.- Render the reporting grid with export actions and contextual metadata badges.
  return (
    <Card className="border border-muted/60 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HiMiniDocumentChartBar className="h-6 w-6" />
          </span>
          <div>
            <CardTitle className="text-2xl">{t("private.mapReports.title")}</CardTitle>
            <CardDescription>{t("private.mapReports.subtitle")}</CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <HiMiniClock className="h-4 w-4" />
            {t("private.mapReports.actions.schedule")}
          </Button>
          <Button className="gap-2">
            <HiMiniCloudArrowDown className="h-4 w-4" />
            {t("private.mapReports.actions.export")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report, index) => (
          <div key={report.title} className="rounded-xl border border-muted/60 bg-muted/10 p-4 dark:bg-muted/20">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {index + 1} • {report.format}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{report.title}</h3>
              </div>
              <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary shadow-sm">
                {report.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{report.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
