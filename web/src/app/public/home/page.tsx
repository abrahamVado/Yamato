"use client"
import { useSearchParams } from "next/navigation"
// app/page.tsx
import Link from "next/link"
import Image from "next/image"
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
  // enhancement icons
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

/* ----------------------- Feature data (core + enhancements) ----------------------- */
type FeatureItem = {
  icon: React.ReactNode
  title: string
  desc: string
  status?: "Planned" | "In progress" | "Optional"
}

const ALL_FEATURES: FeatureItem[] = [
  // --- core features ---
  { icon: <Layers />,      title: "Multi-tenant & billing", desc: "Isolation first. Stripe-ready hooks and per-tenant config out of the box." },
  { icon: <ShieldCheck />, title: "RBAC & audit",           desc: "Granular roles, permissions, and audit trails for compliance-friendly teams." },
  { icon: <Users />,       title: "Teams & invites",        desc: "Org-level access, SSO-ready patterns, and member management." },
  { icon: <Lock />,        title: "Secure by default",      desc: "Best-practice headers, session hardening, and input sanitization." },
  { icon: <Server />,      title: "API & jobs",             desc: "Typed endpoints and background-jobs pattern for long-running tasks." },
  { icon: <Cpu />,         title: "DX tuned",               desc: "shadcn/ui, Tailwind, and a clean module layout so you ship faster." },

  // --- enhancements folded into same grid ---
  { icon: <Shield />,           title: "PII vault & redaction",    desc: "Field-level encryption, tokenization, and secure views for sensitive data." },
  { icon: <Globe />,            title: "i18n & locale routing",    desc: "Localized routes, ICU formats, number/date pluralization, RTL support." },
  { icon: <Boxes />,            title: "Background jobs & queue",  desc: "Queue adapter (Redis/SQS) + job dashboard for retries and scheduling." },
  { icon: <Terminal />,         title: "Developer CLI",            desc: "Scaffold modules, run code-mods, seed tenants, and sync environments." },
  { icon: <FileText />,         title: "Audit exports & SIEM",     desc: "Tamper-evident audit log with CSV/Parquet export and SIEM sinks." },
  { icon: <Cloud />,            title: "File storage & media",     desc: "Signed uploads, image transforms, and lifecycle policies per tenant." },

]

/* ----------------------------------- Page ----------------------------------- */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
    <header className="w-full border-b bg-background px-6 py-4">
      <div className="flex max-w-7xl mx-auto items-center justify-between">
        {/* Left logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          Yamato
        </Link>

        {/* Right menu */}
        <div className="flex items-center gap-4 text-sm">
          <Link href="/modules" className="hover:text-primary">Modules</Link>
          <Link href="/docs" className="hover:text-primary">Docs</Link>
          <Link href="/auth/register" className="hover:text-primary">Register</Link>
          <Link href="/auth/login" className="hover:text-primary">Login</Link>
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
                Open-source + Enterprise-ready
              </Badge>

              <h1 className="text-balance text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                Ship production-ready SaaS,{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  reliable, secure and audit-ready.
                </span>
              </h1>
              <p className="text-balance max-w-[780px] text-muted-foreground">
                Yamato Enterprise is a multi-tenant Next.js + shadcn/ui starter with RBAC, audit trails, and a retractable
                sidebar UX. Build secure dashboards your customers love—without wiring the basics.
              </p>
              {/* Mockup / artwork + legend */}
              <div className="relative mt-0 flex justify-center md:mt-0">
                <figure className="inline-flex flex-col items-center gap-3">
                  <Image
                    src="/yamato_logo.svg"
                    width={520}
                    height={380}
                    alt="Yamato Enterprise dashboard preview"
                    priority
                    className="relative block"
                  />
                </figure>
              </div>


              {/* KPIs */}
              <div className="w-full max-w-[820px] pt-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Stat icon={<Timer className="h-4 w-4" />} value="~15 min" label="to first deploy" />
                  <Stat icon={<Building2 className="h-4 w-4" />} value="100+" label="tenants per cluster" />
                  <Stat icon={<KeyRound className="h-4 w-4" />} value="RBAC" label="roles & permissions built-in" />
                  <Stat icon={<BarChart3 className="h-4 w-4" />} value="Observability" label="Metrics, tracing, and Reports" />
                  <Stat
                        icon={<Github className="h-4 w-4" />}
                        value="Open source"
                        label="MIT-licensed core"
                      />
                      {/* NEW: Security */}
                      <Stat
                        icon={<ShieldCheck className="h-4 w-4" />}
                        value="Security"
                        label="CSP, 2FA-ready"
                      />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES (core + enhancements) */}
        <section id="features" className="container max-w-[1100px] py-16 md:py-24" aria-label="Features">
          <div className="mx-auto max-w-[780px] text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl">Everything you need</h2>
            <p className="mt-3 text-muted-foreground">
              Stop wiring the foundation—focus on your moat. Yamato Enterprise ships batteries-included for modern
              multi-tenant SaaS.
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
                    alt="Yamato Enterprise preview"
                    priority
                    className="w-[160px] md:w-[180px] drop-shadow-sm select-none pointer-events-none"
                  />
                </div>

              </div>

              {/* COPY: 8/12 (≈2/3) on md+ */}
              <div className="md:col-span-8">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                  Ready to launch your next SaaS?
                </h3>
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Let <span className="font-medium px-1"> Yamato </span> handle the basic and boring parts.
                  </Badge>
                <p className="mt-2 text-muted-foreground">
                  Start from a secure, multi-tenant foundation with a polished UI and sane defaults.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Try the demo <Rocket className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link
                      href="https://github.com/salimi-my/shadcn-ui-sidebar"
                      target="_blank" rel="noopener noreferrer"
                    >
                      GitHub
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
