"use client"

//1.- Import the UI primitives used to compose the split layout hero.
import type { FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginShowcaseProps = {
  //2.- Receive the dictionary-driven copy and all controlled form bindings from the page container.
  dict: {
    title: string
    subtitle: string
    cta: string
    forgot: string
    remember?: string
    error: string
    common: { email: string; password: string; sign_up: string }
  }
  email: string
  password: string
  remember: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onRememberChange: (value: boolean) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  errorMessage?: string | null
  isSubmitting?: boolean
}

export function LoginShowcase({
  dict,
  email,
  password,
  remember,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  errorMessage,
  isSubmitting = false,
}: LoginShowcaseProps) {
  //3.- Draft a set of whimsical bullet points to spark product imagination.
  const highlights = [
    {
      title: "Predictive Ops",
      body: "Stay ahead of incidents with AI-backed runbooks tied to Yamato workflows.",
    },
    {
      title: "Tenant Intelligence",
      body: "Inspect module adoption, license posture and billing health in one sweep.",
    },
    {
      title: "Global Sync",
      body: "Every dashboard, role and policy syncs to the edge in under 30 seconds.",
    },
  ]

  //4.- Render the responsive split layout with the marketing panel and the form panel.
  return (
    <div className="min-h-dvh flex items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <section className="space-y-10">
            {/* 5.- Hero headline and tone-setting lead copy. */}
            <header className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
                Control Tower Access
              </span>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {dict.title}
              </h1>
              <p className="text-lg text-white/70 sm:text-xl">{dict.subtitle}</p>
            </header>

            {/* 6.- Animated illustration and highlight list to "allucinate" the platform value. */}
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
              <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent)]" />
                <Image
                  src="/calico_cat.svg"
                  alt="Calico command mascot"
                  width={420}
                  height={420}
                  priority
                  className="relative z-10 mx-auto h-auto w-[320px] select-none sm:w-[380px]"
                />
                <div className="relative z-10 border-t border-white/10 bg-black/40 px-6 py-4 text-sm text-white/70">
                  Fast-track federated onboarding with the Yamato command mascot overseeing traffic lanes.
                </div>
              </div>
              <ul className="space-y-5 text-white/80">
                {highlights.map((item) => (
                  <li key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner">
                    <p className="text-sm font-semibold uppercase tracking-widest text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 7.- Present the fully controlled login form with the provided bindings. */}
          <section className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
              {errorMessage && (
                <p className="rounded-lg border border-red-400/60 bg-red-500/20 px-4 py-3 text-sm text-red-50">
                  {errorMessage}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  {dict.common.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  {dict.common.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-white/70">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(value) => onRememberChange(Boolean(value))}
                  />
                  <span>{dict.remember ?? "Remember me"}</span>
                </label>
                <Link href="/public/forgot-password" className="text-sm text-white hover:text-white/70">
                  {dict.forgot}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {dict.cta}
              </Button>

              <p className="text-center text-xs text-white/60">
                By logging in you agree to the Yamato Operator Guidelines and calibrate your cockpit to mission readiness.
              </p>
            </form>

            <div className="mt-8 text-center text-sm text-white/70">
              <span className="mr-2">Need an account?</span>
              <Link href="/public/register" className="text-white hover:text-white/80">
                {dict.common.sign_up}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
