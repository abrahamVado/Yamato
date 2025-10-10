// src/app/(public)/register/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useI18n } from "@/app/providers/I18nProvider"
import { apiMutation } from "@/lib/api-client"
import enBase from "./lang/en.json"

type Dict = {
  title: string
  subtitle: string
  cta: string
  success?: string
  error?: string
  validation?: {
    name?: string
    email?: string
    password?: string
  }
  common: {
    name: string
    email: string
    password: string
    have_account: string
    sign_in: string
  }
}

function extractVerificationNotice(payload: unknown): string | null {
  //1.- Walk common response keys so any backend-provided guidance bubbles up to the UI.
  if (!payload || typeof payload !== "object") {
    return null
  }
  const candidates = [
    "verification_notice",
    "notice",
    "instructions",
    "message",
    "status",
  ] as const
  for (const key of candidates) {
    const value = (payload as Record<string, unknown>)[key]
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }
  const nested = (payload as Record<string, unknown>).data
  if (nested && typeof nested === "object") {
    return extractVerificationNotice(nested)
  }
  return null
}

export default function RegisterPage() {
  const { locale } = useI18n()
  const router = useRouter()
  const [dict, setDict] = React.useState<Dict>(enBase as Dict)
  const [email, setEmail] = React.useState("")
  const [name, setName] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<{
    name?: string
    email?: string
    password?: string
  }>({})

  // Localized current date
  const dateLabel = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale || "en", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(new Date())
    } catch {
      return new Intl.DateTimeFormat("en", {
        year: "numeric",
        day: "2-digit",
        month: "long",
      }).format(new Date())
    }
  }, [locale])

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

  const fallbackErrorMessage = dict.error ?? "We couldn't create your account."

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    //1.- Prevent duplicate submissions while the previous request is still processing.
    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)
    setFormError(null)
    setFieldErrors({})
    try {
      const trimmedName = name.trim()
      const trimmedEmail = email.trim()
      //2.- Forward the collected credentials to Laravel so it can create the pending user record.
      const response = await apiMutation<Record<string, unknown>>("auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password }),
      })

      //3.- Capture any verification notice and pass it along to the confirmation screen.
      const notice = extractVerificationNotice(response) ?? dict.success ?? ""
      const query = new URLSearchParams({ email: trimmedEmail })
      if (notice) {
        query.set("notice", notice.replace("{email}", trimmedEmail))
      }
      router.push(`/public/verify-email?${query.toString()}`)
    } catch (error) {
      //4.- Promote Laravel's validation response so operators know which fields need attention.
      let message = fallbackErrorMessage
      if (error instanceof Error && error.message) {
        message = error.message
      }
      const body = (error as { body?: { message?: string; errors?: Record<string, string[]> } })?.body
      if (body?.message) {
        message = body.message
      }
      if (body?.errors) {
        const mapped: { name?: string; email?: string; password?: string } = {}
        for (const [field, errors] of Object.entries(body.errors)) {
          if (errors && errors.length > 0) {
            if (field === "name" || field === "email" || field === "password") {
              mapped[field] = errors[0]
            }
          }
        }
        setFieldErrors(mapped)
        if (!body.message) {
          const firstFieldMessage = Object.values(mapped).find(Boolean)
          if (firstFieldMessage) {
            message = firstFieldMessage
          }
        }
      }
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 transform -translate-y-6 md:-translate-y-10 lg:-translate-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 place-items-center">
          {/* Left: form */}
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-semibold">{dict.title}</h1>
            <p className="mt-2 text-muted-foreground">{dict.subtitle}</p>

            {formError ? (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">{dict.common.name}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
                {fieldErrors.name ? (
                  <p className="mt-1 text-sm text-destructive">{fieldErrors.name}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="email">{dict.common.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                {fieldErrors.email ? (
                  <p className="mt-1 text-sm text-destructive">{fieldErrors.email}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="password">{dict.common.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                {fieldErrors.password ? (
                  <p className="mt-1 text-sm text-destructive">{fieldErrors.password}</p>
                ) : null}
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? `${dict.cta}…` : dict.cta}
              </Button>
            </form>

            <div className="mt-4 text-sm text-muted-foreground">
              <Link href="/public/login">
                {dict.common.have_account} {dict.common.sign_in}
              </Link>
            </div>
          </div>

          {/* Right: cat logo + info (uses existing /public/cat_logo.svg) */}
          <div className="w-full flex flex-col items-center justify-center">
            <img
              src="/black_cat.svg"
              alt="Cat logo"
              className="w-[340px] sm:w-[380px] lg:w-[420px] max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
