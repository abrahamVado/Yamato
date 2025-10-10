import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

function resolveApiBaseUrl(): URL {
  //1.- Prefer the explicit server-side override while falling back to the public configuration.
  const candidate = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
  const trimmed = candidate.trim()
  if (!trimmed) {
    throw new Error("API base URL is not configured")
  }
  try {
    const parsed = new URL(trimmed)
    return parsed
  } catch {
    throw new Error("API base URL must be an absolute URL")
  }
}

function buildTargetUrl(base: URL, path: string[], search: string): string {
  //1.- Normalize the captured path segments so the backend receives the original endpoint.
  const joined = path.join("/")
  const normalizedPath = joined.replace(/^\/+/, "")
  const url = new URL(base.toString())
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/${normalizedPath}`.replace(/\/+/, "/")
  //2.- Reapply any search parameters included in the client request.
  url.search = search
  return url.toString()
}

function createForwardHeaders(request: NextRequest): Headers {
  //1.- Copy the essential headers that Laravel expects for authentication and localization.
  const headers = new Headers()
  const forward = ["accept", "accept-language", "content-type", "cookie", "authorization", "x-requested-with"]
  for (const name of forward) {
    const value = request.headers.get(name)
    if (value) {
      headers.set(name, value)
    }
  }
  return headers
}

async function proxyRequest(request: NextRequest, params: { path?: string[] }): Promise<NextResponse> {
  //1.- Resolve the upstream target URL so the proxy can forward the call.
  let baseUrl: URL
  try {
    baseUrl = resolveApiBaseUrl()
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : "API base URL is not configured"
    return NextResponse.json({ message }, { status: 500 })
  }
  const segments = Array.isArray(params.path) ? params.path : []
  const target = buildTargetUrl(baseUrl, segments, request.nextUrl.search)

  //2.- Recreate the original request so authentication cookies and payloads reach the backend.
  const init: RequestInit = {
    method: request.method,
    headers: createForwardHeaders(request),
    redirect: "manual",
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body
  }

  let upstream: Response
  try {
    upstream = await fetch(target, init)
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : "Proxy request failed"
    return NextResponse.json({ message }, { status: 502 })
  }

  //3.- Mirror the upstream response so the browser receives payloads and cookies verbatim.
  const headers = new Headers()
  for (const [key, value] of upstream.headers.entries()) {
    if (key.toLowerCase() === "set-cookie") {
      continue
    }
    if (key.toLowerCase() === "content-length") {
      continue
    }
    headers.set(key, value)
  }

  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  })

  const setCookie = (upstream.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.()
  if (setCookie && setCookie.length > 0) {
    for (const cookie of setCookie) {
      response.headers.append("set-cookie", cookie)
    }
  } else {
    const single = upstream.headers.get("set-cookie")
    if (single) {
      response.headers.set("set-cookie", single)
    }
  }

  return response
}

async function handle(request: NextRequest, context: { params: { path?: string[] } }): Promise<NextResponse> {
  //1.- Delegate to the shared proxy implementation so every HTTP verb behaves consistently.
  return proxyRequest(request, context.params)
}

export async function GET(request: NextRequest, context: { params: { path?: string[] } }) {
  //1.- Forward GET requests such as metadata lookups through the proxy.
  return handle(request, context)
}

export async function POST(request: NextRequest, context: { params: { path?: string[] } }) {
  //1.- Forward POST requests such as registration submissions through the proxy.
  return handle(request, context)
}

export async function PUT(request: NextRequest, context: { params: { path?: string[] } }) {
  //1.- Forward PUT requests so resource updates avoid CORS constraints.
  return handle(request, context)
}

export async function PATCH(request: NextRequest, context: { params: { path?: string[] } }) {
  //1.- Forward PATCH requests for partial updates.
  return handle(request, context)
}

export async function DELETE(request: NextRequest, context: { params: { path?: string[] } }) {
  //1.- Forward DELETE requests for resource removal flows.
  return handle(request, context)
}

export async function OPTIONS(request: NextRequest, context: { params: { path?: string[] } }) {
  //1.- Forward OPTIONS requests to ensure any preflight checks succeed when browsers send them explicitly.
  return handle(request, context)
}

export async function HEAD(request: NextRequest, context: { params: { path?: string[] } }) {
  //1.- Forward HEAD requests for lightweight availability checks.
  return handle(request, context)
}
