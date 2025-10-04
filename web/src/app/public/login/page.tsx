// src/app/(public)/login/page.tsx
"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useI18n } from "@/app/providers/I18nProvider"
import enBase from "./lang/en.json"
import { LoginShowcase } from "@/components/views/public/LoginShowcase"

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
    <LoginShowcase
      dict={dict}
      email={email}
      password={password}
      remember={remember}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onRememberChange={setRemember}
      onSubmit={onSubmit}
    />
  )
}
