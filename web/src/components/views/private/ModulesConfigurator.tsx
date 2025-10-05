"use client"

//1.- Pull in localization hooks, React state, and the icon-enhanced UI primitives used in the module console.
import * as React from "react"
import { useI18n } from "@/app/providers/I18nProvider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  HiMiniShieldCheck,
  HiMiniSquaresPlus,
  HiMiniBanknotes,
  HiMiniGlobeAsiaAustralia,
  HiMiniSparkles,
  HiMiniPresentationChartBar,
  HiMiniLightBulb,
  HiMiniNewspaper,
} from "react-icons/hi2"
import type { IconType } from "react-icons"

type ModuleTier = "core" | "pilot" | "beta"
type ModuleOwner = "security" | "operations" | "finance" | "platform"
type IconKey =
  | "shield"
  | "squares"
  | "banknotes"
  | "globe"
  | "sparkles"
  | "presentation"
  | "lightbulb"
  | "newspaper"

const iconMap: Record<IconKey, IconType> = {
  shield: HiMiniShieldCheck,
  squares: HiMiniSquaresPlus,
  banknotes: HiMiniBanknotes,
  globe: HiMiniGlobeAsiaAustralia,
  sparkles: HiMiniSparkles,
  presentation: HiMiniPresentationChartBar,
  lightbulb: HiMiniLightBulb,
  newspaper: HiMiniNewspaper,
}

export type ModuleDefinition = {
  //2.- Describe the base metadata for each Yamato module surfaced in the configurator.
  name: string
  description: string
  owner: ModuleOwner
  enabled: boolean
  tier: ModuleTier
  icon: IconKey
}

type BacklogDefinition = {
  //3.- Capture the exploratory module backlog so stakeholders can prioritize investment.
  name: string
  theme: string
  benefit: string
  icon: IconKey
}

//4.- Define the default catalogue for English fallback rendering when locales omit overrides.
const defaultModules: ModuleDefinition[] = [
  {
    name: "Identity graph",
    description: "Cross-tenant identity stitching that reconciles SSO, SCIM and Yamato-native users.",
    owner: "security",
    enabled: true,
    tier: "core",
    icon: "shield",
  },
  {
    name: "Orchestration studio",
    description: "No-code automations blending playbooks, approvals and incident choreography.",
    owner: "operations",
    enabled: true,
    tier: "pilot",
    icon: "squares",
  },
  {
    name: "License guardian",
    description: "Predict overages and orchestrate downgrades before invoices spike across tenants.",
    owner: "finance",
    enabled: false,
    tier: "beta",
    icon: "banknotes",
  },
  {
    name: "Telemetry lake",
    description: "Unified observability pipeline with long-term retention for compliance audits.",
    owner: "platform",
    enabled: true,
    tier: "core",
    icon: "globe",
  },
]

//5.- Author a curated backlog of future modules so operators can choose what to incubate next.
const defaultBacklog: BacklogDefinition[] = [
  {
    name: "Predictive churn radar",
    theme: "Customer success",
    benefit: "Blend product telemetry and CRM signals to trigger proactive save plays for at-risk accounts.",
    icon: "sparkles",
  },
  {
    name: "Usage-based billing copilot",
    theme: "Finance",
    benefit: "Forecast invoices, detect anomalies and surface margin insights for consumption-driven plans.",
    icon: "presentation",
  },
  {
    name: "AI onboarding concierge",
    theme: "Growth",
    benefit: "Guide new tenants through tailored checklists, in-app tours and contextual upsell nudges.",
    icon: "lightbulb",
  },
  {
    name: "Customer health newsroom",
    theme: "Operations",
    benefit: "Publish daily briefs on adoption milestones, sentiment surveys and executive sponsor engagement.",
    icon: "newspaper",
  },
]

function hydrateModule(entry: Partial<ModuleDefinition> | undefined, fallback: ModuleDefinition): ModuleDefinition {
  //6.- Merge dictionary-driven overrides with the default definition while retaining type safety.
  if (!entry) return fallback
  const merged = {
    ...fallback,
    ...entry,
  }
  return {
    ...merged,
    owner: (merged.owner ?? fallback.owner) as ModuleOwner,
    tier: (merged.tier ?? fallback.tier) as ModuleTier,
    icon: (merged.icon ?? fallback.icon) as IconKey,
    enabled: Boolean(merged.enabled ?? fallback.enabled),
  }
}

function hydrateBacklog(
  entry: Partial<BacklogDefinition> | undefined,
  fallback: BacklogDefinition,
): BacklogDefinition {
  //7.- Apply the same hydration strategy to the backlog records to support localization overrides.
  if (!entry) return fallback
  const merged = {
    ...fallback,
    ...entry,
  }
  return {
    ...merged,
    icon: (merged.icon ?? fallback.icon) as IconKey,
  }
}

export function ModulesConfigurator() {
  //8.- Retrieve localized copy and data definitions so the console respects the active locale.
  const { t, dict } = useI18n()
  const moduleDict = dict.private?.modules ?? {}
  const catalogue = Array.isArray(moduleDict.catalogue)
    ? (moduleDict.catalogue as Partial<ModuleDefinition>[])
    : undefined
  const backlog = Array.isArray(moduleDict.backlog?.items)
    ? (moduleDict.backlog.items as Partial<BacklogDefinition>[])
    : undefined

  const hydratedModules = React.useMemo(
    () =>
      (catalogue ?? []).map((item, index) =>
        hydrateModule(item, defaultModules[index] ?? defaultModules[0]),
      ),
    [catalogue],
  )
  const hydratedBacklog = React.useMemo(
    () =>
      (backlog ?? []).map((item, index) =>
        hydrateBacklog(item, defaultBacklog[index] ?? defaultBacklog[0]),
      ),
    [backlog],
  )

  const [modules, setModules] = React.useState<ModuleDefinition[]>(
    hydratedModules.length > 0 ? hydratedModules : defaultModules,
  )
  const resolvedBacklog = hydratedBacklog.length > 0 ? hydratedBacklog : defaultBacklog

  React.useEffect(() => {
    //10.- Realign the module state whenever localized catalogue data changes (e.g., locale switches).
    if (hydratedModules.length > 0) {
      setModules(hydratedModules)
    }
  }, [hydratedModules])

  function handleToggle(name: string, value: boolean) {
    //9.- Update the module entry immutably to keep React state predictable and accessible.
    setModules((current) =>
      current.map((module) =>
        module.name === name
          ? {
              ...module,
              enabled: value,
            }
          : module,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 dark:from-backgroun
d dark:via-background dark:to-primary/10">
        <CardHeader>
          <CardTitle>{t("private.modules.title")}</CardTitle>
          <CardDescription>{t("private.modules.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {modules.map((module, index) => {
            const Icon = iconMap[module.icon] ?? HiMiniSquaresPlus
            return (
              <div
                key={module.name}
                data-test="module-row"
                className="grid gap-3 rounded-xl border border-muted bg-muted/20 p-4 transition hover:border-primary dark:border-muted/60 dark:bg-muted/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {index + 1}. {module.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="uppercase tracking-widest">
                      {t(`private.modules.tiers.${module.tier}`)}
                    </Badge>
                    <Badge variant="secondary">{t(`private.modules.owners.${module.owner}`)}</Badge>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={(value) => handleToggle(module.name, Boolean(value))}
                      aria-label={t("private.modules.a11y.toggle", { module: module.name })}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {module.enabled
                    ? t("private.modules.status.enabled")
                    : t("private.modules.status.disabled")}
                </p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* 11.- Outline a short list of possible new modules, keeping content concise for stakeholder review. */}
      <Card className="border border-primary/20 bg-primary/5 dark:bg-primary/10">
        <CardHeader>
          <CardTitle>{t("private.modules.backlog.title")}</CardTitle>
          <CardDescription>{t("private.modules.backlog.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {resolvedBacklog.map((candidate, index) => {
            const Icon = iconMap[candidate.icon] ?? HiMiniSparkles
            return (
              <div
                key={candidate.name}
                data-test="backlog-row"
                className="flex flex-col justify-between gap-3 rounded-xl border border-dashed border-primary/40 bg-background/70 p-4 dark:bg-background/40 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                      {index + 1}. {candidate.theme}
                    </p>
                    <h4 className="text-base font-semibold text-foreground">{candidate.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground sm:max-w-[420px]">{candidate.benefit}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
