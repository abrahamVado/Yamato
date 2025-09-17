"use client"

import Link from "next/link"
import Image from "next/image"
import * as React from "react"
import { useI18n } from "@/app/providers/I18nProvider"
import { LanguageToggle } from "@/components/language-toggle"

import {
  PanelsTopLeft,
  Rocket,
  ShieldCheck,
  Users,
  Layers,
  Cpu,
  Lock,
  Server,
  Sparkles,
  ArrowRight,
  Github,
  Timer,
  Building2,
  KeyRound,
  Globe,
  Webhook,
  Bot,
  Cloud,
  Settings,
  Terminal,
  FileText,
  Shield,
  CircleDollarSign,
  BarChart3,
  Flag,
  Boxes,
  Database,
  GitBranch,
  FlaskConical,
  Menu
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"

/* ----------------------- Types ----------------------- */
type FeatureItem = {
  icon: React.ReactNode
  title: string
  desc: string
  status?: "Planned" | "In progress" | "Optional"
}

type DictFeature = { title: string; desc: string }

/* ----------------------------------- Page ----------------------------------- */
export default function HomePage() {
  const { t, dict } = useI18n()

  // KPIs from dict
  const KPIS = [
    { icon: <Timer className="h-4 w-4" />,      value: t("kpis.deploy_time.value"),   label: t("kpis.deploy_time.label") },
    { icon: <Building2 className="h-4 w-4" />,  value: t("kpis.tenants.value"),       label: t("kpis.tenants.label") },
    { icon: <KeyRound className="h-4 w-4" />,   value: t("kpis.rbac.value"),          label: t("kpis.rbac.label") },
    { icon: <BarChart3 className="h-4 w-4" />,  value: t("kpis.observability.value"), label: t("kpis.observability.label") },
    { icon: <Github className="h-4 w-4" />,     value: t("kpis.oss.value"),           label: t("kpis.oss.label") },
    { icon: <ShieldCheck className="h-4 w-4" />,value: t("kpis.security.value"),      label: t("kpis.security.label") }
  ]

  // Icons mapped to the order of features.items in the JSON
  const featureIcons: React.ReactNode[] = [
    <Layers key="layers" />,      // Multi-tenant & billing
    <ShieldCheck key="shieldc" />,// RBAC & audit
    <Users key="users" />,        // Teams & invites
    <Lock key="lock" />,          // Secure by default
    <Server key="server" />,      // API & jobs
    <Cpu key="cpu" />,            // DX tuned
    <Shield key="shield" />,      // PII vault & redaction
    <Globe key="globe" />,        // i18n & locale routing
    <Boxes key="boxes" />,        // Background jobs & queue
    <Terminal key="terminal" />,  // Developer CLI
    <FileText key="filetext" />,  // Audit exports & SIEM
    <Cloud key="cloud" />         // File storage & media
  ]

  // ---- SAFE features build (no crash if features/items missing) ----
  const featureItems = (dict as any)?.features?.items as DictFeature[] | undefined

  if (process.env.NODE_ENV !== "production" && !featureItems) {
    // Helpful during development if a locale forgot the section
    // eslint-disable-next-line no-console
    console.warn("[home] Missing dict.features.items — rendering 0 features")
  }

  // Render all JSON items; if there are fewer icons, reuse the first as fallback
  const ALL_FEATURES: FeatureItem[] = (featureItems ?? []).map((it, i) => ({
    icon: featureIcons[i] ?? featureIcons[0],
    title: it.title,
    desc: it.desc
  }))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="w-full border-b bg-background px-6 py-4">
        <div className="flex max-w-7xl mx-auto items-center justify-between">
          {/* Left logo */}
          {/* Left logo */}
          <Link href="/public" className="text-xl font-bold tracking-tight text-primary">
            {t("brand")}
          </Link>

          {/* Right menu */}
          <div className="flex items-center gap-4 text-sm">
            <Link href="/public/modules" className="hover:text-primary">{t("nav.modules")}</Link>
            <Link href="/public/docs" className="hover:text-primary">{t("nav.docs")}</Link>
            <Link href="/public/register" className="hover:text-primary">{t("nav.register")}</Link>
            <Link href="/public/login" className="hover:text-primary">{t("nav.login")}</Link>
            <LanguageToggle />
            <ModeToggle />
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* HERO */}
        <section aria-label="Hero" className="relative border-b">
          {/* Ambient background */}
          <div className="absolute inset-0 -z-10">
            <div className="h-full w-full bg-gradient-to-b from-primary/10 via-transparent to-transparent"></div>
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(600px 300px at 50% -10%, hsl(var(--primary)/0.20), transparent), radial-gradient(800px 400px at 100% 0%, hsl(var(--primary)/0.12), transparent)",
                maskImage:
                  "radial-gradient(ellipse at center, black 60%, transparent 100%)",
              }}
            ></div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                color: "hsl(var(--foreground))",
              }}
            ></div>
          </div>

          <div className="container max-w-[1100px] py-7 md:py-10 lg:py-14">
            <div className="mx-auto flex max-w-[900px] flex-col items-center gap-5 text-center">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                {t("badge.os_enterprise")}
              </Badge>

              <h1 className="text-balance text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                {t("hero.title")}
              </h1>
              <p className="text-balance max-w-[780px] text-muted-foreground">
                {t("hero.subtitle")}
              </p>

              {/* Mockup / artwork + legend */}
              <div className="relative mt-0 flex justify-center md:mt-0">
                <figure className="inline-flex flex-col items-center gap-3">
                  <Image
                    src="/yamato_logo.svg"
                    width={520}
                    height={380}
                    alt={t("hero.image_alt")}
                    priority
                    className="relative block"
                  />
                </figure>
              </div>

              {/* KPIs */}
              <div className="w-full max-w-[820px] pt-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {KPIS.map((kpi) => (
                    <Stat key={kpi.label + kpi.value} icon={kpi.icon} value={kpi.value} label={kpi.label} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES (core + enhancements) */}
        <section id="features" className="container max-w-[1100px] py-16 md:py-24" aria-label="Features">
          <div className="mx-auto max-w-[780px] text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl">{t("features.heading")}</h2>
            <p className="mt-3 text-muted-foreground">
              {t("features.subheading")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_FEATURES.map((f) => (
              <Feature key={f.title} icon={f.icon} title={f.title} status={f.status}>
                {f.desc}
              </Feature>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA (image 1/3, copy 2/3) */}
        <section className="relative border-t">
          <div className="container max-w-[1100px] py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center md:gap-6 gap-8">
              {/* IMAGE: 4/12 (≈1/3) on md+ */}
              <div className="md:col-span-4 order-1 md:order-none">
                <div className="relative flex md:justify-center justify-center">
                  <Image
                    src="/ready.svg"
                    width={180}
                    height={120}
                    alt={t("cta.image_alt")}
                    priority
                    className="w-[160px] md:w-[180px] drop-shadow-sm select-none pointer-events-none"
                  />
                </div>
              </div>

              {/* COPY: 8/12 (≈2/3) on md+ */}
              <div className="md:col-span-8">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                  {t("cta.heading")}
                </h3>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  {t("cta.badge", { brand: t("brand") })}
                </Badge>
                <p className="mt-2 text-muted-foreground">
                  {t("cta.copy")}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      {t("cta.buttons.try_demo")} <Rocket className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link
                      href="https://github.com/salimi-my/shadcn-ui-sidebar"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("cta.buttons.github")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

/* -------------------------------- Components -------------------------------- */

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <Card className="group relative h-full overflow-hidden border-muted transition-colors hover:border-primary/30">
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="grid gap-1">
          <div className="text-lg font-semibold leading-none">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
        <div className="rounded-md border bg-background p-2 text-primary shadow-sm" aria-hidden="true">
          {icon}
        </div>
      </CardContent>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(120deg, transparent 0%, hsl(var(--primary)/0.06) 50%, transparent 100%)",
          maskImage: "linear-gradient(transparent, black 20%, black 80%, transparent)",
        }}
      ></div>
    </Card>
  )
}

function Feature({
  icon,
  title,
  children,
  status,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  status?: "Planned" | "In progress" | "Optional"
}) {
  return (
    <Card className="h-full border-muted transition-colors hover:border-primary/30">
      <CardHeader className="space-y-1 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="grid h-9 w-9 place-items-center rounded-lg border bg-background text-primary shadow-sm"
            aria-hidden="true"
          >
            {icon}
          </div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            {status ? (
              <Badge variant="outline" className="h-5 px-2 text-[11px]">
                {status}
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  )
}
