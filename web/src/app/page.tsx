import Link from "next/link"
import Image from "next/image"
import { PanelsTopLeft, Rocket, ShieldCheck, Users, Layers, Cpu, Lock, Server, Sparkles, ArrowRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="z-[50] sticky top-0 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container h-14 flex items-center">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <PanelsTopLeft className="w-6 h-6 mr-3" />
            <span className="font-bold tracking-tight">Yamato Enterprise</span>
            <span className="sr-only">Yamato Enterprise</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full w-8 h-8" asChild>
              <Link href="https://github.com/salimi-my/shadcn-ui-sidebar" target="_blank" rel="noopener noreferrer">
                <Github className="h-[1.1rem] w-[1.1rem]" />
              </Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* HERO */}
        <section
          className="relative border-b"
          aria-label="Hero"
        >
          <div
            className="absolute inset-0 -z-10"
            aria-hidden="true"
          >
            {/* Subtle radial/gradient bg */}
            <div className="h-full w-full bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_-10%,hsl(var(--primary)/.20),transparent)]" />
          </div>

          <div className="container py-14 md:py-20 lg:py-28 max-w-[1100px]">
            <div className="mx-auto flex flex-col items-center text-center gap-5">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Open-source + Enterprise ready
              </Badge>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Ship production-ready SaaS, <span className="text-primary">fast</span>.
              </h1>

              <p className="text-muted-foreground max-w-[760px] text-balance">
                Yamato Enterprise is a multi-tenant Next.js + shadcn/ui starter with RBAC, audit trails,
                and a retractable sidebar UX. Build secure dashboards your customers love—without wiring the basics.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Live demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer">
                    Learn shadcn/ui
                  </Link>
                </Button>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-4 pt-6 w-full max-w-[720px]">
                <Card className="border-muted">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">~15 min</div>
                    <div className="text-xs text-muted-foreground">to first deploy</div>
                  </CardContent>
                </Card>
                <Card className="border-muted">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">100+ </div>
                    <div className="text-xs text-muted-foreground">tenants per cluster</div>
                  </CardContent>
                </Card>
                <Card className="border-muted">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">RBAC</div>
                    <div className="text-xs text-muted-foreground">roles & permissions built-in</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mockup images */}
            <div className="mt-10 md:mt-14 relative flex justify-center">
              <Image
                src="/logosmichis.svg"
                width={600}
                height={400}
                alt="Yamato Enterprise dashboard demo (light)"
                priority
                className="shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="container py-16 md:py-24 max-w-[1100px]" aria-label="Features">
          <div className="mx-auto text-center max-w-[780px]">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Everything you need</h2>
            <p className="text-muted-foreground mt-3">
              Stop wiring the foundation—focus on your moat. Yamato Enterprise ships batteries-included for
              modern multi-tenant SaaS.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature icon={<Layers />} title="Multi-tenant & billing">
              Isolation first. Stripe-ready hooks and per-tenant config out of the box.
            </Feature>
            <Feature icon={<ShieldCheck />} title="RBAC & audit">
              Granular roles, permissions, and audit trails for compliance-friendly teams.
            </Feature>
            <Feature icon={<Users />} title="Teams & invites">
              Org-level access, SSO-ready patterns, and member management.
            </Feature>
            <Feature icon={<Lock />} title="Secure by default">
              Best-practice headers, session hardening, and input sanitization.
            </Feature>
            <Feature icon={<Server />} title="API & jobs">
              Typed endpoints and background jobs pattern for long-running tasks.
            </Feature>
            <Feature icon={<Cpu />} title="DX tuned">
              shadcn/ui, Tailwind, and a clean module layout so you ship faster.
            </Feature>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard">
                Try the demo <Rocket className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="https://github.com/salimi-my/shadcn-ui-sidebar" target="_blank" rel="noopener noreferrer">
                Star on GitHub
              </Link>
            </Button>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="border-t bg-muted/30">
          <div className="container py-10 md:py-12">
            <p className="text-center text-sm text-muted-foreground mb-6">
              Trusted patterns used by teams shipping real SaaS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
              {/* Replace these with real monochrome logos when ready */}
              <LogoPill>Acme</LogoPill>
              <LogoPill>Northwind</LogoPill>
              <LogoPill>Kite</LogoPill>
              <LogoPill>Nova</LogoPill>
              <LogoPill>Flux</LogoPill>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 md:py-10 border-t">
        <div className="container flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            Built with Next.js + shadcn/ui. Sidebar patterns adapted for Yamato Enterprise.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
                Learn shadcn/ui <Sparkles className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">
                Launch demo <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ---------- Helpers ---------- */
function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-muted h-full">
      <CardHeader className="space-y-1 pb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border w-9 h-9 grid place-items-center bg-background">
            <span className="text-primary">{icon}</span>
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  )
}

function LogoPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 rounded-full border bg-background text-muted-foreground text-sm">
      {children}
    </div>
  )
}
