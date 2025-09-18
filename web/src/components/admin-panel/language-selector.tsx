// src/components/admin-panel/language-selector.tsx
"use client"

import * as React from "react"
import Image from "next/image"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/app/providers/I18nProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Locale = "en" | "es" | "pt" | "zh" | "ja"

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English",      flag: "/flags/us.svg" },
  { code: "es", label: "Español (MX)", flag: "/flags/mx.svg" },
  { code: "pt", label: "Português",    flag: "/flags/br.svg" },
  { code: "zh", label: "中文",          flag: "/flags/cn.svg" },
  { code: "ja", label: "日本語",         flag: "/flags/jp.svg" },
]

function persistLocale(code: Locale) {
  try { localStorage.setItem("locale", code) } catch {}
  if (typeof document !== "undefined") {
    document.cookie = `yamato_locale=${code}; Path=/; Max-Age=${60 * 60 * 24 * 365}`
  }
}

export function LanguageSelector({ withLabel = false }: { withLabel?: boolean }) {
  const { locale, setLocale } = useI18n() as { locale: Locale; setLocale?: (l: Locale) => void }
  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0]

  const change = (code: Locale) => {
    persistLocale(code)
    if (typeof setLocale === "function") setLocale(code)
    else if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("locale-change", { detail: code }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="relative hidden sm:inline-block h-4 w-4">
            <Image src={current.flag} alt={current.label} fill sizes="16px" />
          </span>
          <Globe className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline text-xs">
            {withLabel ? current.label : current.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map(l => (
          <DropdownMenuItem
            key={l.code}
            className={l.code === current.code ? "bg-accent" : ""}
            onClick={() => change(l.code)}
            aria-selected={l.code === current.code}
          >
            <span className="relative mr-2 inline-block h-4 w-4">
              <Image src={l.flag} alt={l.label} fill sizes="16px" />
            </span>
            <span className="flex-1">{l.label}</span>
            <kbd className="text-[10px] text-muted-foreground">{l.code.toUpperCase()}</kbd>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
