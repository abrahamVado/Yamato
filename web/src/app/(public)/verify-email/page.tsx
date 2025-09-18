
"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/app/providers/I18nProvider"
import enBase from "./lang/en.json"

type Dict = {
  title: string
  subtitle: string  // contains {email}
  back_to_login: string
}

export default function VerifyEmailPage() {
  const { locale } = useI18n()
  const sp = useSearchParams()
  const email = sp.get("email") || "your@email.com"
  const [dict, setDict] = React.useState<Dict>(enBase as Dict)

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

  const subtitleHtml = React.useMemo(
    () => (dict.subtitle || "").replace("{email}", email),
    [dict.subtitle, email]
  )

  return (
    <div className="container max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold">{dict.title}</h1>
      <p className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: subtitleHtml }} />
      <div className="mt-6">
        <Button asChild><Link href="/public/login">{dict.back_to_login}</Link></Button>
      </div>
    </div>
  )
}
