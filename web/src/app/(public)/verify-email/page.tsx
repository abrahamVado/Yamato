
"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useI18n } from "@/app/providers/I18nProvider"
import { apiMutation, apiRequest } from "@/lib/api-client"
import enBase from "./lang/en.json"

type Dict = {
  title: string
  subtitle: string // contains {email}
  verifying: string
  verified: string
  verification_failed: string
  resend_title: string
  resend_description: string // contains {email}
  resend_label: string
  resend_placeholder: string
  resend_cta: string
  resend_pending: string
  resend_success: string
  resend_error: string
  back_to_login: string
}

function extractMessage(payload: unknown): string | null {
  //1.- Scan nested payloads so Laravel's messaging surfaces regardless of structure.
  if (!payload || typeof payload !== "object") {
    return null
  }
  const candidates = ["message", "status", "notice", "verification_notice", "instructions"] as const
  for (const key of candidates) {
    const value = (payload as Record<string, unknown>)[key]
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }
  const data = (payload as Record<string, unknown>).data
  if (data && typeof data === "object") {
    return extractMessage(data)
  }
  const meta = (payload as Record<string, unknown>).meta
  if (meta && typeof meta === "object") {
    return extractMessage(meta)
  }
  return null
}

export default function VerifyEmailPage() {
  const { locale } = useI18n()
  const sp = useSearchParams()
  const id = sp.get("id")
  const hash = sp.get("hash")
  const expires = sp.get("expires")
  const signature = sp.get("signature")
  const emailParam = sp.get("email") || ""
  const noticeParam = sp.get("notice") || ""
  const [dict, setDict] = React.useState<Dict>(enBase as Dict)
  const [status, setStatus] = React.useState<"idle" | "verifying" | "success" | "error">(
    id && hash ? "verifying" : "idle",
  )
  const [statusMessage, setStatusMessage] = React.useState(() =>
    noticeParam ? noticeParam.replace("{email}", emailParam) : "",
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [resendEmail, setResendEmail] = React.useState(emailParam)
  const [resendMessage, setResendMessage] = React.useState<string | null>(null)
  const [resendError, setResendError] = React.useState<string | null>(null)
  const [isResending, setIsResending] = React.useState(false)

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

  React.useEffect(() => {
    //1.- Keep the resend form synced with the email query parameter as the locale or route changes.
    setResendEmail(emailParam)
    if (noticeParam) {
      setStatusMessage(noticeParam.replace("{email}", emailParam))
    }
  }, [emailParam, noticeParam])

  React.useEffect(() => {
    if (!id || !hash) {
      return
    }
    const safeId = id
    const safeHash = hash
    let cancelled = false
    async function verify() {
      setStatus("verifying")
      setErrorMessage(null)
      try {
        //2.- Forward the signature metadata verbatim so Laravel can validate the verification link.
        const query = new URLSearchParams()
        if (expires) query.set("expires", expires)
        if (signature) query.set("signature", signature)
        const path = `email/verify/${encodeURIComponent(safeId)}/${encodeURIComponent(safeHash)}`
        const url = query.toString() ? `${path}?${query.toString()}` : path
        const response = await apiRequest<Record<string, unknown>>(url, {
          method: "GET",
          credentials: "include",
        })
        if (cancelled) return
        const message = extractMessage(response) ?? dict.verified
        setStatus("success")
        setStatusMessage(message.replace("{email}", emailParam))
      } catch (error) {
        if (cancelled) return
        //3.- Surface Laravel's failure reason so operators know what to do next.
        let message = dict.verification_failed
        if (error instanceof Error && error.message) {
          message = error.message
        }
        const body = (error as { body?: { message?: string } })?.body
        if (body?.message) {
          message = body.message
        }
        setStatus("error")
        setErrorMessage(message)
      }
    }
    verify()
    return () => {
      cancelled = true
    }
  }, [dict.verified, dict.verification_failed, emailParam, expires, hash, id, signature])

  const subtitleHtml = React.useMemo(
    () => (dict.subtitle || "").replace("{email}", `<b>${(resendEmail || emailParam) || "your@email.com"}</b>`),
    [dict.subtitle, resendEmail, emailParam],
  )

  async function onResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsResending(true)
    setResendMessage(null)
    setResendError(null)
    try {
      //4.- Ask Laravel to dispatch another verification notification for the provided email.
      const response = await apiMutation<Record<string, unknown>>("email/verification-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: resendEmail || emailParam }),
      })
      const message = extractMessage(response) ?? dict.resend_success
      setResendMessage(message.replace("{email}", resendEmail || emailParam))
    } catch (error) {
      //5.- Map Laravel's failure message so throttling and invalid-email states are transparent.
      let message = dict.resend_error
      if (error instanceof Error && error.message) {
        message = error.message
      }
      const body = (error as { body?: { message?: string } })?.body
      if (body?.message) {
        message = body.message
      }
      setResendError(message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="container max-w-lg py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{dict.title}</h1>
        <p className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: subtitleHtml }} />
      </div>

      <div className="mt-6 space-y-4">
        {status === "verifying" ? (
          <Alert>
            <AlertTitle>{dict.verifying}</AlertTitle>
          </Alert>
        ) : null}
        {statusMessage && status !== "error" ? (
          <Alert>
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        ) : null}
        {status === "error" && errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>{dict.verification_failed}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
      </div>

      <div className="mt-10 rounded-lg border bg-background p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-left">{dict.resend_title}</h2>
        <p className="mt-1 text-sm text-muted-foreground text-left">
          {dict.resend_description.replace("{email}", resendEmail || emailParam || "your@email.com")}
        </p>

        <form onSubmit={onResend} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <Label htmlFor="resend-email">{dict.resend_label}</Label>
            <Input
              id="resend-email"
              type="email"
              value={resendEmail}
              onChange={(event) => setResendEmail(event.target.value)}
              placeholder={dict.resend_placeholder}
              autoComplete="email"
              required
            />
          </div>
          <Button type="submit" disabled={isResending || !resendEmail}>
            {isResending ? dict.resend_pending : dict.resend_cta}
          </Button>
        </form>

        {resendMessage ? (
          <Alert className="mt-4">
            <AlertDescription>{resendMessage}</AlertDescription>
          </Alert>
        ) : null}
        {resendError ? (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{resendError}</AlertDescription>
          </Alert>
        ) : null}
      </div>

      <div className="mt-8 text-center">
        <Button asChild>
          <Link href="/public/login">{dict.back_to_login}</Link>
        </Button>
      </div>
    </div>
  )
}
