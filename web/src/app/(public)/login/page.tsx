// src/app/(public)/login/page.tsx
"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useI18n } from "@/app/providers/I18nProvider"
import { apiMutation, setStoredToken } from "@/lib/api-client"
import { resolvePostLoginRedirect } from "@/lib/login-redirect"
import enBase from "./lang/en.json"
import { LoginShowcase } from "@/components/views/public/LoginShowcase"

type Dict = {
  title: string
  subtitle: string
  cta: string
  forgot: string
  error: string
  remember?: string
  common: { email: string; password: string; sign_up: string }
}

type LoginSuccessPayload = {
  token?: string
  plainTextToken?: string
  data?: { token?: string } | null
}

export default function LoginPage() {
  const { locale } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [dict, setDict] = React.useState<Dict>(enBase as Dict)
  const [email, setEmail] = React.useState("admin@yamato.local")
  const [password, setPassword] = React.useState("admin")
  const [remember, setRemember] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const fromParam = searchParams.get("from")
  const redirectTarget = React.useMemo(
    () => resolvePostLoginRedirect(fromParam),
    [fromParam],
  )

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
    return () => {
      mounted = false
    }
  }, [locale])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await apiMutation<LoginSuccessPayload>("auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, remember }),
      })

      const tokenCandidate =
        typeof response?.token === "string"
          ? response.token
          : typeof response?.plainTextToken === "string"
            ? response.plainTextToken
            : response?.data &&
                typeof response.data === "object" &&
                typeof response.data.token === "string"
              ? response.data.token
              : null

      if (tokenCandidate) {
        setStoredToken(tokenCandidate)
      }

      router.push(redirectTarget)
    } catch (error) {
      let message = dict.error

      if (error instanceof Error && error.message) {
        message = error.message
      }

      const body = (error as {
        body?: { message?: string; errors?: Record<string, string[]> }
      })?.body

      if (body?.errors) {
        const firstFieldErrors = Object.values(body.errors).find(
          (messages) => messages.length > 0,
        )
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

    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginShowcase
          dict={dict}
          email={email}
          password={password}
          remember={remember}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onRememberChange={setRemember}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
