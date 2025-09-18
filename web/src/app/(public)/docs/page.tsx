// src/app/(public)/docs/page.tsx
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
    <>
      <h1>{dict.title}</h1>
      <p className="lead">{dict.subtitle}</p>

      <h2>What is Yamato?</h2>
      <p>
        Yamato is a multi-tenant SaaS boilerplate with auth, RBAC, observability,
        and a modern front-end out of the box.
      </p>

      <h2>Quick links</h2>
      <ul>
        <li><a href="/public/docs/installation">Installation</a></li>
        <li><a href="/public/docs/configuration">Configuration</a></li>
        <li><a href="/public/docs/deploy">Deploy</a></li>
      </ul>
    </>
  )
}
