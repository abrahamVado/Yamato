"use client"

import * as React from "react"
import Shell from "@/components/secure/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

type AuthTestResult = {
  id: "register" | "login" | "token" | "verification"
  name: string
  status: "success" | "error" | "skipped"
  durationMs: number
  message: string
  details?: unknown
}

type BackendStatus = {
  baseUrl: string
  host: string | null
  ip: string | null
  reachable: boolean
  status: number | null
  message: string
}

type AuthDiagnosticsReport = {
  backend: BackendStatus
  results: AuthTestResult[]
  context: {
    registeredEmail: string | null
    loginEmail: string | null
    loginToken: string | null
  }
}

const STATUS_VARIANT: Record<AuthTestResult["status"], { label: string; variant: "default" | "destructive" | "secondary" }> = {
  success: { label: "Success", variant: "default" },
  error: { label: "Failure", variant: "destructive" },
  skipped: { label: "Skipped", variant: "secondary" },
}

export default function AuthDiagnosticsPage() {
  const [baseUrl, setBaseUrl] = React.useState<string>(process.env.NEXT_PUBLIC_API_BASE_URL ?? "")
  const [registerName, setRegisterName] = React.useState("Diagnostic User")
  const [registerEmail, setRegisterEmail] = React.useState("diagnostic+{{timestamp}}@example.com")
  const [registerPassword, setRegisterPassword] = React.useState("Password123!")
  const [loginEmail, setLoginEmail] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [verificationEmail, setVerificationEmail] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)
  const [report, setReport] = React.useState<AuthDiagnosticsReport | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  async function runDiagnostics() {
    //1.- Avoid launching duplicate runs while the previous diagnostic is still in flight.
    if (isRunning) {
      return
    }
    setIsRunning(true)
    setErrorMessage(null)
    setReport(null)
    try {
      //2.- Forward the operator-provided configuration to the secure diagnostics API.
      const response = await fetch("/private/api/diagnostics/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: baseUrl.trim() || undefined,
          register:
            registerEmail.trim() && registerPassword.trim() && registerName.trim()
              ? {
                  name: registerName.trim(),
                  email: registerEmail.trim(),
                  password: registerPassword,
                }
              : undefined,
          login:
            loginEmail.trim() && loginPassword.trim()
              ? {
                  email: loginEmail.trim(),
                  password: loginPassword,
                  remember,
                }
              : undefined,
          verification:
            verificationEmail.trim()
              ? { email: verificationEmail.trim() }
              : registerEmail.trim()
                ? { email: registerEmail.trim() }
                : undefined,
        }),
      })
      if (!response.ok) {
        throw new Error((await response.json().catch(() => ({ message: response.statusText }))).message ?? response.statusText)
      }
      const data = (await response.json()) as AuthDiagnosticsReport
      setReport(data)
    } catch (error) {
      //3.- Surface unexpected failures so operators can adjust the payload and retry.
      const message = error instanceof Error && error.message ? error.message : "Diagnostics failed"
      setErrorMessage(message)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Shell>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication diagnostics</CardTitle>
            <CardDescription>
              Provide the backend coordinates and sample credentials to validate registration, login, verification, and token issuance workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="base-url">API base URL</Label>
              <Input
                id="base-url"
                placeholder="https://backend.example.com/api"
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="register-name">Registration name</Label>
                <Input
                  id="register-name"
                  value={registerName}
                  onChange={(event) => setRegisterName(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="register-email">Registration email template</Label>
                <Input
                  id="register-email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  placeholder="diagnostic+{{timestamp}}@example.com"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-password">Registration password</Label>
              <Input
                id="register-password"
                type="password"
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="login-email">Login email</Label>
                <Input
                  id="login-email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="admin@yamato.local"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-password">Login password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="remember" checked={remember} onCheckedChange={setRemember} />
              <Label htmlFor="remember">Remember device during login test</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="verification-email">Verification email override</Label>
              <Input
                id="verification-email"
                value={verificationEmail}
                onChange={(event) => setVerificationEmail(event.target.value)}
                placeholder="Leave blank to reuse the registration address"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={runDiagnostics} disabled={isRunning}>
                {isRunning ? "Running tests…" : "Run diagnostics"}
              </Button>
              {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
            </div>
            <p className="text-xs text-muted-foreground">
              The email template supports the token <code>{"{{timestamp}}"}</code> to generate unique addresses for each run.
            </p>
          </CardContent>
        </Card>

        {report ? (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Backend {report.backend.reachable ? "responded" : "is unreachable"} at {report.backend.baseUrl}
                {report.backend.host ? ` (host: ${report.backend.host}` : ""}
                {report.backend.ip ? `, ip: ${report.backend.ip}` : report.backend.host ? ")" : ""}
                {report.backend.host && !report.backend.ip ? ")" : ""}
                {report.backend.message ? `. ${report.backend.message}` : "."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3">
                {report.results.map((result) => {
                  const statusMeta = STATUS_VARIANT[result.status]
                  return (
                    <div key={result.id} className="rounded-lg border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{result.name}</p>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-sm">
                          <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                          <span className="text-muted-foreground">{result.durationMs} ms</span>
                        </div>
                      </div>
                      {result.details ? (
                        <pre className="mt-3 max-h-60 overflow-auto rounded bg-muted p-3 text-xs">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                  )
                })}
              </div>
              <div className="rounded-lg border p-4 text-sm">
                <p className="font-medium">Captured context</p>
                <div className="mt-2 grid gap-1">
                  <p>Registered email: {report.context.registeredEmail ?? "n/a"}</p>
                  <p>Login email: {report.context.loginEmail ?? "n/a"}</p>
                  <p>Token: {report.context.loginToken ?? "n/a"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </Shell>
  )
}

