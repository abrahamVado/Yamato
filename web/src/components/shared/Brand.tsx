// src/components/shared/Brand.tsx
"use client"

import Link from "next/link"
import * as React from "react"
import { useI18n } from "@/app/providers/I18nProvider"

export function BrandLink() {
  const { t } = useI18n()
  return (
    <Link href="/" className="brand-link">
      {t("brand")}
    </Link>
  )
}
