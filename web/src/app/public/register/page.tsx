
"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/app/providers/I18nProvider"

export default function RegisterPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.location.href = "/public/verify-email?email=" + encodeURIComponent(email)
  }

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold">{t("auth.register.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("auth.register.subtitle")}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">{t("auth.common.name")}</Label>
          <Input id="name" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">{t("auth.common.email")}</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">{t("auth.common.password")}</Label>
          <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <Button className="w-full" type="submit">{t("auth.register.cta")}</Button>
      </form>
      <div className="mt-4 text-sm text-muted-foreground">
        <Link href="/public/login">{t("auth.common.have_account")} {t("auth.common.sign_in")}</Link>
      </div>
    </div>
  )
}
