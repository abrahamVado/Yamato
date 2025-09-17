
"use client"

import * as React from "react"
import { useI18n } from "@/app/providers/I18nProvider"
import enBase from "./lang/en.json"

type DocsDict = { title: string; subtitle: string }

export default function DocsPage() {
  const { locale } = useI18n()
  const [dict, setDict] = React.useState<DocsDict>(enBase as DocsDict)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const mod = await import(`./lang/${locale}.json`)
        const d = (mod as any).default ?? mod
        if (mounted) setDict(d as DocsDict)
      } catch {
        if (mounted) setDict(enBase as DocsDict)
      }
    })()
    return () => { mounted = false }
  }, [locale])

  return (
    <div className="container max-w-4xl py-10 prose dark:prose-invert">
      <h1>{dict.title}</h1>
      <p>{dict.subtitle}</p>
    </div>
  )
}
