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

// Configure the languages you support
const LOCALES = [
  { code: "en", label: "English", flag: "/lang/us.svg" },
  { code: "es", label: "Español", flag: "/lang/mx.svg" },
  { code: "pt", label: "Português", flag: "/lang/br.svg" },
  { code: "zh", label: "中文",    flag: "/lang/cn.svg" },
  { code: "ja", label: "日本語",  flag: "/lang/jp.svg" },
] as const

type LocaleCode = (typeof LOCALES)[number]["code"]

// Cookie helpers (simple, client-side)
const COOKIE_NAME = "yamato_lang"
function setLangCookie(value: string) {
  // 180 days
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax`
}
function getLangCookie(): string | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

// Replace first path segment if it matches a locale
function replaceLocaleInPath(path: string, next: LocaleCode): string {
  const segs = path.split("/")
  // Example: "", "en", "products"...
  if (LOCALES.some(l => l.code === segs[1])) {
    segs[1] = next
    return segs.join("/") || "/"
  }
  // If you don't use locale prefixes, just return the same path
  return path
}

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()

  // Initial locale from cookie, or detect from path prefix, or fallback to "en"
  const initialFromCookie = React.useMemo(() => getLangCookie(), [])
  const initialFromPath = React.useMemo(() => {
    const seg = pathname?.split("/")[1]
    return LOCALES.find(l => l.code === seg)?.code
  }, [pathname])

  const fallback: LocaleCode = "en"
  const initialCode = (initialFromCookie as LocaleCode) || (initialFromPath as LocaleCode) || fallback
  const [current, setCurrent] = React.useState<LocaleCode>(initialCode)

  React.useEffect(() => {
    // Keep cookie aligned if it differs
    const c = getLangCookie()
    if (c !== current) setLangCookie(current)
  }, [current])

  const active = LOCALES.find(l => l.code === current) ?? LOCALES[0]

  const onSelect = (code: LocaleCode) => {
    if (code === current) return
    setCurrent(code)
    setLangCookie(code)
    // If you use /en/... prefixed routes, update the URL:
    const nextPath = replaceLocaleInPath(pathname, code)
    router.push(nextPath)
    // If you DON'T use prefixed routes, you can instead trigger your i18n switch here.
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
