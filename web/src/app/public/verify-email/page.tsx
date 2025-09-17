
"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/app/providers/I18nProvider"

export default function VerifyEmailPage() {
  const { t } = useI18n()
  const sp = useSearchParams()
  const email = sp.get("email") || "your@email.com"
  return (
    <div className="container max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold">{t("auth.verify.title")}</h1>
      <p className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{
        __html: t("auth.verify.subtitle", { email })
      }} />
      <div className="mt-6">
        <Button asChild><Link href="/public/login">{t("auth.verify.back_to_login")}</Link></Button>
      </div>
    </div>
  )
}
