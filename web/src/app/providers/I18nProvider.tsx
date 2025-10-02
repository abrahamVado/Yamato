"use client"

import React from "react"

// ---- Base dict (always present, used for SSR-safe first render) ----
import baseEN from "@/app/(public)/home/lang/en.json"

type Dict = Record<string, any>
type I18nContextValue = {
  locale: string
  dict: Dict
  ready: boolean
  t: (path: string, vars?: Record<string, string | number>) => string
  setLocale: (loc: string) => void
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj)
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str
  return Object.keys(vars).reduce((acc, k) => acc.replaceAll(`{${k}}`, String(vars[k])), str)
}

// shallow-ish deep merge good enough for i18n trees
function deepMerge<T extends Dict>(base: T, over: Dict): T {
  const out: Dict = Array.isArray(base) ? [...base] : { ...base }
  for (const [k, v] of Object.entries(over || {})) {
    if (v && typeof v === "object" && !Array.isArray(v) && typeof base[k] === "object" && base[k] != null && !Array.isArray(base[k])) {
      out[k] = deepMerge(base[k], v)
    } else {
      out[k] = v
    }
  }
  return out as T
}

async function loadLocaleDict(locale: string): Promise<Dict> {
  if (locale === "en") return baseEN as Dict
  try {
    const mod = await import(`@/app/(public)/home/lang/${locale}.json`)
    const loc = (mod as any).default ?? mod
    // Merge over EN so missing keys (e.g., features.items) fall back gracefully
    return deepMerge(baseEN as Dict, loc)
  } catch {
    // Fallback to base EN
    return baseEN as Dict
  }
}

export function I18nProvider({
  children,
  defaultLocale = "en",
  locale: initialLocale,
  dict: initialDict,
}: {
  children: React.ReactNode
  defaultLocale?: string
  locale?: string
  dict?: Dict
}) {
  //1.- Decide which locale to start with (SSR can inject a specific locale).
  const resolvedLocale = initialLocale ?? defaultLocale
  //2.- Initialize the dictionary with either the injected value or the base EN fallback.
  const startingDict = (initialDict as Dict | undefined) ?? (baseEN as Dict)

  //3.- Persist locale/dictionary in state so client transitions remain reactive.
  const [locale, setLocale] = React.useState(resolvedLocale)
  const [dict, setDict] = React.useState<Dict>(startingDict)
  const [ready, setReady] = React.useState(true)

  // Load persisted locale AFTER mount (no hydration differences)
  React.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("locale") : null
    if (saved && saved !== locale) {
      setReady(false)
      loadLocaleDict(saved).then(d => {
        setDict(d)
        setLocale(saved)
        setReady(true)
      })
    }
  }, [locale])

  // When user changes locale via toggle
  const changeLocale = React.useCallback((loc: string) => {
    if (loc === locale) return
    setReady(false)
    loadLocaleDict(loc).then(d => {
      setDict(d)
      setLocale(loc)
      try { localStorage.setItem("locale", loc) } catch {}
      setReady(true)
    })
  }, [locale])

  const t = React.useCallback((path: string, vars?: Record<string, string | number>) => {
    const raw = getByPath(dict, path)
    if (typeof raw === "string") return interpolate(raw, vars)
    // return key if missing so it's obvious in UI
    return path
  }, [dict])

  const value = React.useMemo<I18nContextValue>(() => ({
    locale, dict, ready, t, setLocale: changeLocale
  }), [locale, dict, ready, t, changeLocale])

  return (
    <I18nContext.Provider value={value}>
      {/* Optionally gate render while switching locales to avoid flashes
          but EN is preloaded, so safe to always render */}
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = React.useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
