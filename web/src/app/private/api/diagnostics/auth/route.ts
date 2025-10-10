import { NextRequest, NextResponse } from "next/server"
import { lookup } from "node:dns/promises"
import { runAuthDiagnostics } from "@/lib/auth-diagnostics"

export const runtime = "nodejs"

function resolveBaseUrl(override?: string | null): string | null {
  //1.- Prefer the explicit override from the request body so operators can test alternative backends.
  if (override && typeof override === "string" && override.trim().length > 0) {
    return override
  }
  //2.- Fall back to environment variables that mirror the public API client configuration.
  const candidate = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? ""
  return candidate.trim().length > 0 ? candidate : null
}

async function lookupHost(hostname: string): Promise<string | null> {
  //1.- Ask the OS resolver for the backend address so the UI can display the reachable IP.
  try {
    const result = await lookup(hostname)
    return result.address
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    //1.- Parse the JSON body to capture operator-provided credentials and overrides.
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  const body = (payload ?? {}) as {
    baseUrl?: string
    register?: { name: string; email: string; password: string }
    login?: { email: string; password: string; remember?: boolean }
    verification?: { email?: string }
  }

  const baseUrl = resolveBaseUrl(body.baseUrl ?? null)
  if (!baseUrl) {
    return NextResponse.json({ message: "API base URL is not configured" }, { status: 500 })
  }

  try {
    //2.- Execute the diagnostics suite so the frontend can render per-endpoint outcomes.
    const report = await runAuthDiagnostics(
      {
        baseUrl,
        register: body.register,
        login: body.login,
        verification: body.verification,
        cookies: request.headers.get("cookie") ?? undefined,
        lookupHost,
      },
      fetch,
    )
    return NextResponse.json(report, { status: 200 })
  } catch (error) {
    //3.- Surface unexpected runtime failures for observability while hiding internal stack traces.
    const message = error instanceof Error && error.message ? error.message : "Diagnostics failed"
    return NextResponse.json({ message }, { status: 500 })
  }
}

