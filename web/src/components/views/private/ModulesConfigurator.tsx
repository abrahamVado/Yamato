"use client"

//1.- Pull in React state helpers and the UI primitives used to build the module matrix.
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export type ModuleDefinition = {
  //2.- Describe the base metadata for each Yamato module surfaced in the configurator.
  name: string
  description: string
  owner: string
  enabled: boolean
  tier: "core" | "pilot" | "beta"
}

//3.- Define the current module catalogue that administrators can toggle live.
const defaultModules: ModuleDefinition[] = [
  {
    name: "Identity graph",
    description: "Cross-tenant identity stitching that reconciles SSO, SCIM and Yamato-native users.",
    owner: "Security",
    enabled: true,
    tier: "core",
  },
  {
    name: "Orchestration studio",
    description: "No-code automations blending playbooks, approvals and incident choreography.",
    owner: "Operations",
    enabled: true,
    tier: "pilot",
  },
  {
    name: "License guardian",
    description: "Predict overages and orchestrate downgrades before invoices spike across tenants.",
    owner: "Finance",
    enabled: false,
    tier: "beta",
  },
  {
    name: "Telemetry lake",
    description: "Unified observability pipeline with long-term retention for compliance audits.",
    owner: "Platform",
    enabled: true,
    tier: "core",
  },
]

//4.- Surface a curated backlog of future modules so operators can choose what to incubate next.
const prospectiveModules = [
  {
    name: "Predictive churn radar",
    theme: "Customer success",
    benefit: "Blend product telemetry and CRM signals to trigger proactive save plays for at-risk accounts.",
  },
  {
    name: "Usage-based billing copilot",
    theme: "Finance",
    benefit: "Forecast invoices, detect anomalies and surface margin insights for consumption-driven plans.",
  },
  {
    name: "AI onboarding concierge",
    theme: "Growth",
    benefit: "Guide new tenants through tailored checklists, in-app tours and contextual upsell nudges.",
  },
  {
    name: "Customer health newsroom",
    theme: "Operations",
    benefit: "Publish daily briefs on adoption milestones, sentiment surveys and executive sponsor engagement.",
  },
]

export function ModulesConfigurator() {
  //5.- Track the local toggle state so operators can stage what-if module rollouts.
  const [modules, setModules] = React.useState(defaultModules)

  function handleToggle(name: string, value: boolean) {
    //6.- Update the module entry immutably to keep React state predictable.
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
      <Card>
        <CardHeader>
          <CardTitle>Module control center</CardTitle>
          <CardDescription>
            Tune which Yamato experiences are visible to each tenant before pushing changes to production.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {modules.map((module) => (
            <div
              key={module.name}
              className="grid gap-3 rounded-xl border border-muted bg-muted/20 p-4 transition hover:border-primary"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold">{module.name}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="uppercase tracking-widest">
                    {module.tier}
                  </Badge>
                  <Badge variant="secondary">{module.owner}</Badge>
                  <Switch
                    checked={module.enabled}
                    onCheckedChange={(value) => handleToggle(module.name, Boolean(value))}
                    aria-label={`Toggle ${module.name}`}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {module.enabled
                  ? "Active tenants will see live telemetry updates within 60 seconds of rollout."
                  : "Disabled tenants retain historical analytics but lose write access until re-enabled."}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7.- Outline a short list of possible new modules, keeping content concise for stakeholder review. */}
      <Card>
        <CardHeader>
          <CardTitle>Future module backlog</CardTitle>
          <CardDescription>
            Share this exploration list with product leadership and pick the next incubation track.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {prospectiveModules.map((candidate) => (
            <div
              key={candidate.name}
              className="flex flex-col justify-between gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  {candidate.theme}
                </p>
                <h4 className="text-base font-semibold text-foreground">{candidate.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground sm:max-w-[420px]">{candidate.benefit}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
