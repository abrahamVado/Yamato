
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/app/providers/I18nProvider"
import enBase from "./lang/en.json"

type Dict = {
  title: string
  subtitle: string
  cta: string
  sent_ok: string
  common: { email: string }
}

export default function ForgotPasswordPage() {
  const { locale } = useI18n()
  const [dict, setDict] = React.useState<Dict>(enBase as Dict)
  const [email, setEmail] = React.useState("")

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
    alert(dict.sent_ok)
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
        <Button className="w-full" type="submit">{dict.cta}</Button>
      </form>
    </div>
  )
}
