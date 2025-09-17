
"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/app/providers/I18nProvider"

export default function LoginPage() {
  const { t } = useI18n()
  const sp = useSearchParams()
  const [email, setEmail] = useState("admin@yamato.local")
  const [password, setPassword] = useState("admin")
  const from = sp.get("from") || "/dashboard"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/auth/signin", { method: "POST", body: JSON.stringify({ email, password }) })
    if (res.ok) window.location.href = from; else alert(t("auth.login.error"))
  }

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold">{t("auth.login.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("auth.login.subtitle")}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">{t("auth.common.email")}</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">{t("auth.common.password")}</Label>
          <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <Button className="w-full" type="submit">{t("auth.login.cta")}</Button>
      </form>
      <div className="mt-4 text-sm text-muted-foreground flex justify-between">
        <Link href="/register">{t("auth.common.sign_up")}</Link>
        <Link href="/forgot-password">{t("auth.login.forgot")}</Link>
      </div>
    </div>
  )
}
