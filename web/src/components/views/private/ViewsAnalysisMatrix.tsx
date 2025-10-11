"use client"

//1.- Import internationalization utilities, the neumorphic shell, and UI shells to narrate the catalog of Yamato views.
import { useI18n } from "@/app/providers/I18nProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HiMiniListBullet, HiMiniCheckBadge } from "react-icons/hi2"
import { PrivateNeumorphicShell } from "./PrivateNeumorphicShell"

interface ViewEntry {
  view: string
  purpose: string
  status: string
}

export function ViewsAnalysisMatrix() {
  //2.- Extract localized metadata so numbering, descriptions, and badges adapt per language.
  const { t, dict } = useI18n()
  const views = (dict.private?.viewsAnalysis?.items ?? []) as ViewEntry[]
  const footnote = dict.private?.viewsAnalysis?.footnote as string | undefined

  //3.- Render an enumerated list that highlights each view, its intent, and delivery stage within the neumorphic frame.
  return (
    <PrivateNeumorphicShell testId="views-neumorphic-card">
      <Card className="border border-muted/60 bg-background/80">
        <CardHeader className="flex items-start gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HiMiniListBullet className="h-6 w-6" />
          </span>
          <div>
            <CardTitle className="text-2xl">{t("private.viewsAnalysis.title")}</CardTitle>
            <CardDescription>{t("private.viewsAnalysis.subtitle")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.7fr)] items-center gap-3 rounded-xl border border-muted/60 bg-muted/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{t("private.viewsAnalysis.table.headingOrder")}</span>
            <span>{t("private.viewsAnalysis.table.headingView")}</span>
            <span>{t("private.viewsAnalysis.table.headingPurpose")}</span>
            <span>{t("private.viewsAnalysis.table.headingStatus")}</span>
          </div>
          {views.map((entry, index) => (
            <div
              key={entry.view}
              className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.7fr)] items-start gap-3 rounded-xl border border-muted/40 bg-background/80 px-4 py-4 shadow-sm"
            >
              <span className="text-sm font-semibold text-primary">{index + 1}</span>
              <span className="text-base font-semibold text-foreground">{entry.view}</span>
              <span className="text-sm text-muted-foreground">{entry.purpose}</span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <HiMiniCheckBadge className="h-4 w-4 text-primary" />
                {entry.status}
              </span>
            </div>
          ))}
          {footnote && <p className="text-xs text-muted-foreground">{footnote}</p>}
        </CardContent>
      </Card>
    </PrivateNeumorphicShell>
  )
}
