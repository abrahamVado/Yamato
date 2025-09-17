
"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/app/providers/I18nProvider"
import enBase from "./lang/en.json"

type Dict = {
  title: string
  subtitle: string
  cta: string
  forgot: string
  error: string
  common: { email: string; password: string; sign_up: string }
}

export default function LoginPage() {
  const { locale } = useI18n()
  const sp = useSearchParams()
  const [dict, setDict] = React.useState<Dict>(enBase as Dict)
  const [email, setEmail] = React.useState("admin@yamato.local")
  const [password, setPassword] = React.useState("admin")
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
    const res = await fetch("/api/auth/signin", { method: "POST", body: JSON.stringify({ email, password }) })
    if (res.ok) window.location.href = from; else alert(dict.error)
  }

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold">{dict.title}</h1>
      <p className="mt-2 text-muted-foreground">{dict.subtitle}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">{dict.common.email}</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">{dict.common.password}</Label>
          <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <Button className="w-full" type="submit">{dict.cta}</Button>
      </form>
      <div className="mt-4 text-sm text-muted-foreground flex justify-between">
        <Link href="/register">{dict.common.sign_up}</Link>
        <Link href="/forgot-password">{dict.forgot}</Link>
      </div>
    </div>
  )
}
