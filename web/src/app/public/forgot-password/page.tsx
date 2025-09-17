
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/app/providers/I18nProvider"

export default function ForgotPasswordPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(t("auth.recover.sent_ok"))
  }
  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold">{t("auth.recover.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("auth.recover.subtitle")}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">{t("auth.common.email")}</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <Button className="w-full" type="submit">{t("auth.recover.cta")}</Button>
      </form>
    </div>
  )
}
