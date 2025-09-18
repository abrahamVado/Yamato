// src/app/public/login/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox" // ⬅️ added
import { useI18n } from "@/app/providers/I18nProvider"
import enBase from "./lang/en.json"

type Dict = {
  title: string
  subtitle: string
  cta: string
  forgot: string
  error: string
  remember?: string // ⬅️ optional i18n key (fallback below)
  common: { email: string; password: string; sign_up: string }
}

export default function LoginPage() {
  const { locale } = useI18n()
  const sp = useSearchParams()
  const [dict, setDict] = React.useState<Dict>(enBase as Dict)
  const [email, setEmail] = React.useState("admin@yamato.local")
  const [password, setPassword] = React.useState("admin")
  const [remember, setRemember] = React.useState<boolean>(true) // ⬅️ state
  const from = sp.get("from") || "/dashboard"

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
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember }), // ⬅️ send remember
    })
    if (res.ok) window.location.href = from
    else alert(dict.error)
  }

  return (
    <div className="min-h-dvh flex items-center">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 transform -translate-y-6 md:-translate-y-10 lg:-translate-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 place-items-center">
          {/* Right: cat image */}
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src="/calico_cat.svg"
              alt="Cat logo"
              width={420}
              height={420}
              priority
              className="w-[340px] sm:w-[380px] lg:w-[420px] max-w-full h-auto select-none"
            />
          </div>

          {/* Left: form */}
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-semibold">{dict.title}</h1>
            <p className="mt-2 text-muted-foreground">{dict.subtitle}</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">{dict.common.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">{dict.common.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
<input
  id="remember"
  type="checkbox"
  checked={remember}
  onChange={(e) => setRemember(e.target.checked)}
  className="h-6 w-6 rounded border-input text-primary focus:ring-2 focus:ring-ring accent-[hsl(var(--primary))]"
/>

                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    {dict.remember ?? "Remember me"}
                  </Label>
                </div>
                <Link href="/public/forgot-password" className="text-sm text-primary hover:underline">
                  {dict.forgot}
                </Link>
              </div>

              <Button className="w-full" type="submit">
                {dict.cta}
              </Button>
            </form>

            <div className="mt-4 flex justify-between text-sm text-muted-foreground">
              <Link href="/public/register" className="hover:underline">
                {dict.common.sign_up}
              </Link>
              {/* kept a secondary forgot link for parity; you can remove if redundant */}
              <Link href="/public/forgot-password" className="hover:underline">
                {dict.forgot}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
