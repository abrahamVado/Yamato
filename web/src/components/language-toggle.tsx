"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/app/providers/I18nProvider"

// Supported locales (must match the JSON files your provider can load)
const LOCALES = [
  { code: "en", label: "English", flag: "/lang/us.svg" },
  { code: "es", label: "Español", flag: "/lang/mx.svg" },
  { code: "pt", label: "Português", flag: "/lang/br.svg" },
  { code: "zh", label: "中文",    flag: "/lang/cn.svg" },
  { code: "ja", label: "日本語",  flag: "/lang/jp.svg" },
] as const

type LocaleCode = (typeof LOCALES)[number]["code"]

// Optional: update URL if you use locale-prefixed routes like /en/... /es/...
function replaceLocaleInPath(path: string, next: LocaleCode): string {
  const segs = path.split("/")
  if (LOCALES.some(l => l.code === segs[1])) {
    segs[1] = next
    return segs.join("/") || "/"
  }
  return path
}

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()               // ← single source of truth
  const router = useRouter()
  const pathname = usePathname()

  const active = LOCALES.find(l => l.code === locale) ?? LOCALES[0]

  const onSelect = (code: LocaleCode) => {
    if (code === locale) return
    // 1) update i18n (will load/merge dict and re-render)
    setLocale(code)
    // 2) (optional) if using route prefixes, keep URL in sync:
    const nextPath = replaceLocaleInPath(pathname, code)
    if (nextPath !== pathname) router.push(nextPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Change language">
          <Image
            src={active.flag}
            alt={active.label}
            width={20}
            height={20}
            className="rounded-full"
            priority={false}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => onSelect(l.code)}
            className="flex items-center gap-2"
          >
            <Image src={l.flag} alt={l.label} width={18} height={18} className="rounded-full" />
            <span>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
