// src/app/(public)/login/page.tsx
"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useI18n } from "@/app/providers/I18nProvider"
import { apiMutation, setStoredToken } from "@/lib/api-client"
import enBase from "./lang/en.json"
import { LoginShowcase } from "@/components/views/public/LoginShowcase"

type Dict = {
  title: string
  subtitle: string
  cta: string
  forgot: string
  error: string
  remember?: string // ⬅️ optional i18n key (fallback below)
  common: { email: string; password: string; sign_up: string }
}

export default function LoginPage() {
  const { locale } = useI18n()
  const sp = useSearchParams()
  const router = useRouter()
  const [dict, setDict] = React.useState<Dict>(enBase as Dict)
  const [email, setEmail] = React.useState("admin@yamato.local")
  const [password, setPassword] = React.useState("admin")
  const [remember, setRemember] = React.useState<boolean>(true) // ⬅️ state
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const fallbackRedirect = React.useMemo(() => `/${locale}/private/dashboard`, [locale])
  const fromParam = sp.get("from")
  const redirectTarget = React.useMemo(() => {
    //1.- Keep redirect targets inside the app and default to the localized dashboard.
    if (!fromParam) return fallbackRedirect
    return fromParam.startsWith("/") ? fromParam : fallbackRedirect
  }, [fallbackRedirect, fromParam])

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      //1.- Authenticate against Laravel through the shared API helper so the base URL is respected.
      type LoginSuccessPayload = {
        token?: string
        plainTextToken?: string
        data?: { token?: string } | null
      }
      const response = await apiMutation<LoginSuccessPayload>("auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, remember }), // ⬅️ send remember
      })

      //2.- Capture any issued token so API calls carry Sanctum's bearer authorization.
      const tokenCandidate =
        typeof response?.token === "string"
          ? response.token
          : typeof response?.plainTextToken === "string"
            ? response.plainTextToken
            : response?.data && typeof response.data === "object" && typeof response.data.token === "string"
              ? response.data.token
              : null
      if (tokenCandidate) {
        setStoredToken(tokenCandidate)
      }

      //3.- Navigate only after credentials persist so the private dashboard loads authenticated requests.
      router.push(redirectTarget)
    } catch (error) {
      //4.- Promote Laravel's validation messages when available to guide recovery.
      let message = dict.error
      if (error instanceof Error && error.message) {
        message = error.message
      }
      const body = (error as { body?: { message?: string; errors?: Record<string, string[]> } })?.body
      if (body?.errors) {
        const firstFieldErrors = Object.values(body.errors).find((messages) => messages.length > 0)
        if (firstFieldErrors && firstFieldErrors[0]) {
          message = firstFieldErrors[0]
        }
      } else if (body?.message) {
        message = body.message
      }
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <LoginShowcase
      dict={dict}
      email={email}
      password={password}
      remember={remember}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onRememberChange={setRemember}
      onSubmit={onSubmit}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
    />
  )
}
