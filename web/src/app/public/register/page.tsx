// src/app/(public)/register/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/app/providers/I18nProvider"
import enBase from "./lang/en.json"

type Dict = {
  title: string
  subtitle: string
  cta: string
  success?: string
  common: {
    name: string
    email: string
    password: string
    have_account: string
    sign_in: string
  }
}

export default function RegisterPage() {
  const { locale } = useI18n()
  const [dict, setDict] = React.useState<Dict>(enBase as Dict)
  const [email, setEmail] = React.useState("")
  const [name, setName] = React.useState("")
  const [password, setPassword] = React.useState("")

  // Localized current date
  const dateLabel = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale || "en", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(new Date())
    } catch {
      return new Intl.DateTimeFormat("en", {
        year: "numeric",
        day: "2-digit",
        month: "long",
      }).format(new Date())
    }
  }, [locale])

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const mod = await import(`./lang/${locale}.json`)
        const d = (mod as any).default ?? mod
        if (mounted) setDict(d as Dict)
      } catch {
        if (mounted) setDict(enBase as Dict)
      }
    })()
    return () => { mounted = false }
  }, [locale])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.location.href = "/public/verify-email?email=" + encodeURIComponent(email)
  }

  return (
<div className="min-h-dvh flex items-center">
  <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 transform -translate-y-6 md:-translate-y-10 lg:-translate-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 place-items-center">
          {/* Left: form */}
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-semibold">{dict.title}</h1>
            <p className="mt-2 text-muted-foreground">{dict.subtitle}</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">{dict.common.name}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">{dict.common.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">{dict.common.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" type="submit">
                {dict.cta}
              </Button>
            </form>

            <div className="mt-4 text-sm text-muted-foreground">
              <Link href="/public/login">
                {dict.common.have_account} {dict.common.sign_in}
              </Link>
            </div>
          </div>

          {/* Right: cat logo + info (uses existing /public/cat_logo.svg) */}
          <div className="w-full flex flex-col items-center justify-center">
            <img
              src="/black_cat.svg"
              alt="Cat logo"
              className="w-[340px] sm:w-[380px] lg:w-[420px] max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
