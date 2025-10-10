export type AuthDiagnosticsRequest = {
  baseUrl: string
  register?: {
    name: string
    email: string
    password: string
  }
  login?: {
    email: string
    password: string
    remember?: boolean
  }
  verification?: {
    email?: string
  }
  cookies?: string
  lookupHost?: (hostname: string) => Promise<string | null>
}

export type AuthDiagnosticsReport = {
  backend: BackendStatus
  results: AuthTestResult[]
  context: {
    registeredEmail: string | null
    loginEmail: string | null
    loginToken: string | null
  }
}

export type BackendStatus = {
  baseUrl: string
  host: string | null
  ip: string | null
  reachable: boolean
  status: number | null
  message: string
}

export type AuthTestResult = {
  id: "register" | "login" | "token" | "verification"
  name: string
  status: "success" | "error" | "skipped"
  durationMs: number
  message: string
  details?: unknown
}

type FetchLike = (input: RequestInfo, init?: RequestInit) => Promise<Response>

const TIMESTAMP_TOKEN = /\{\{timestamp\}\}/g

function normalizeBaseUrl(baseUrl: string): string {
  //1.- Validate the provided base URL so the diagnostics know where to send requests.
  if (!baseUrl || typeof baseUrl !== "string") {
    throw new Error("A valid API base URL is required to run diagnostics")
  }
  const trimmed = baseUrl.trim()
  if (!trimmed) {
    throw new Error("A valid API base URL is required to run diagnostics")
  }
  //2.- Remove trailing slashes so downstream helpers can concatenate paths safely.
  const withoutTrailing = trimmed.replace(/\/+$/, "")
  //3.- Ensure the URL is absolute by attempting to parse it with the WHATWG URL parser.
  try {
    const parsed = new URL(withoutTrailing)
    return parsed.toString().replace(/\/+$/, "")
  } catch {
    throw new Error("The API base URL must be an absolute URL, including protocol")
  }
}

export function resolveTargetUrl(baseUrl: string, path: string): string {
  //1.- Join the provided path with the base URL while preventing duplicate slashes.
  const normalizedPath = (path || "").replace(/^\/+/, "")
  if (!normalizedPath) {
    return baseUrl
  }
  return `${baseUrl}/${normalizedPath}`
}

export function applyEmailTemplate(template: string, now: number = Date.now()): string {
  //1.- Inject the current timestamp so repeated diagnostics generate unique inboxes.
  return template.replace(TIMESTAMP_TOKEN, String(now))
}

function extractFirstCookie(setCookieHeader: string): [string, string] | null {
  //1.- Split the Set-Cookie header to isolate the actual key/value pair from the attributes.
  const [pair] = setCookieHeader.split(";")
  if (!pair) {
    return null
  }
  const [name, ...rest] = pair.split("=")
  if (!name || rest.length === 0) {
    return null
  }
  return [name.trim(), rest.join("=").trim()]
}

function parseCookieHeader(header: string): Map<string, string> {
  //1.- Build a mutable map so the jar can merge new cookies without duplicating keys.
  const jar = new Map<string, string>()
  const parts = header.split(";")
  for (const part of parts) {
    const [name, ...rest] = part.split("=")
    if (!name || rest.length === 0) {
      continue
    }
    jar.set(name.trim(), rest.join("=").trim())
  }
  return jar
}

function mergeCookieJar(existing: string, setCookies: string[]): string {
  //1.- Parse the existing cookie header so updates override old values instead of appending duplicates.
  const jar = existing ? parseCookieHeader(existing) : new Map<string, string>()
  for (const setCookie of setCookies) {
    const parsed = extractFirstCookie(setCookie)
    if (!parsed) {
      continue
    }
    const [name, value] = parsed
    jar.set(name, value)
  }
  //2.- Reassemble the jar back into a cookie header string for the next request.
  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ")
}

function getSetCookieHeaders(response: Response): string[] {
  //1.- Use Undici's helper when available while gracefully falling back to a manual lookup.
  const raw = (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.()
  if (raw && Array.isArray(raw) && raw.length > 0) {
    return raw
  }
  const header = response.headers.get("set-cookie")
  if (!header) {
    return []
  }
  return [header]
}

function extractMessageFromPayload(payload: unknown): string | null {
  //1.- Walk common Laravel response keys so diagnostic messages surface regardless of shape.
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
    return extractMessageFromPayload(data)
  }
  const meta = (payload as Record<string, unknown>).meta
  if (meta && typeof meta === "object") {
    return extractMessageFromPayload(meta)
  }
  return null
}

function extractTokenFromPayload(payload: unknown): string | null {
  //1.- Accept the token regardless of whether Laravel returns it at the root, nested, or renamed.
  if (!payload || typeof payload !== "object") {
    return null
  }
  if (typeof (payload as Record<string, unknown>).token === "string") {
    return (payload as Record<string, unknown>).token as string
  }
  if (typeof (payload as Record<string, unknown>).plainTextToken === "string") {
    return (payload as Record<string, unknown>).plainTextToken as string
  }
  const data = (payload as Record<string, unknown>).data
  if (data && typeof data === "object") {
    return extractTokenFromPayload(data)
  }
  return null
}

async function checkBackendStatus(
  baseUrl: string,
  fetchImpl: FetchLike,
  lookupHost?: (hostname: string) => Promise<string | null>,
): Promise<BackendStatus> {
  //1.- Attempt a lightweight HEAD request to confirm the backend responds to network calls.
  let reachable = false
  let status: number | null = null
  let message = ""
  try {
    const response = await fetchImpl(baseUrl, { method: "HEAD" })
    reachable = true
    status = response.status
    if (!response.ok) {
      message = `Backend responded with status ${response.status}`
    }
  } catch (error) {
    message = error instanceof Error ? error.message : "Unable to reach backend"
  }
  //2.- Fall back to a GET request when HEAD is blocked so we still detect reachable services.
  if (!reachable) {
    try {
      const response = await fetchImpl(baseUrl, { method: "GET" })
      reachable = true
      status = response.status
      if (!response.ok) {
        message = `Backend responded with status ${response.status}`
      }
    } catch (error) {
      message = error instanceof Error ? error.message : "Unable to reach backend"
    }
  }

  //3.- Resolve the hostname so the UI can display the network target and best-effort IP address.
  let host: string | null = null
  let ip: string | null = null
  try {
    host = new URL(baseUrl).hostname
  } catch {
    host = null
  }
  if (host && lookupHost) {
    try {
      ip = await lookupHost(host)
    } catch {
      ip = null
    }
  }

  return {
    baseUrl,
    host,
    ip,
    reachable,
    status,
    message,
  }
}

async function readJsonResponse(response: Response): Promise<{ data: unknown; rawText: string }> {
  //1.- Consume the response body as text so we can safely parse optional JSON payloads.
  const rawText = await response.text()
  const trimmed = rawText.trim()
  if (!trimmed) {
    return { data: null, rawText: "" }
  }
  try {
    const data = JSON.parse(trimmed)
    return { data, rawText }
  } catch {
    return { data: trimmed, rawText }
  }
}

async function sendJsonRequest(
  url: string,
  body: unknown,
  fetchImpl: FetchLike,
  cookieJar: { current: string },
): Promise<{ response: Response; data: unknown; rawText: string }> {
  //1.- Issue the network request with JSON encoding while replaying any tracked cookies.
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookieJar.current ? { cookie: cookieJar.current } : {}),
    },
    body: JSON.stringify(body ?? {}),
  })
  //2.- Merge new cookies so subsequent requests share the authenticated session state.
  const setCookies = getSetCookieHeaders(response)
  if (setCookies.length > 0) {
    cookieJar.current = mergeCookieJar(cookieJar.current, setCookies)
  }
  const { data, rawText } = await readJsonResponse(response)
  if (!response.ok) {
    const message =
      extractMessageFromPayload(data) || `Request to ${url} failed with status ${response.status}`
    const error = new Error(message)
    ;(error as Error & { status?: number; body?: unknown }).status = response.status
    ;(error as Error & { status?: number; body?: unknown }).body = data
    throw error
  }
  return { response, data, rawText }
}

export async function runAuthDiagnostics(
  request: AuthDiagnosticsRequest,
  fetchImpl: FetchLike,
): Promise<AuthDiagnosticsReport> {
  //1.- Normalize the base URL once so every test shares the same target host.
  const baseUrl = normalizeBaseUrl(request.baseUrl)
  const cookieJar = { current: request.cookies ?? "" }
  const results: AuthTestResult[] = []
  const context = {
    registeredEmail: null as string | null,
    loginEmail: request.login?.email ?? null,
    loginToken: null as string | null,
  }

  const backend = await checkBackendStatus(baseUrl, fetchImpl, request.lookupHost)

  async function runTest(
    id: AuthTestResult["id"],
    name: string,
    runner: () => Promise<{ message: string; details?: unknown }> | null,
  ) {
    //1.- Skip the test early when prerequisites are not satisfied.
    if (!runner) {
      results.push({ id, name, status: "skipped", durationMs: 0, message: "Test not configured" })
      return
    }
    const started = Date.now()
    try {
      const payload = await runner()
      if (!payload) {
        results.push({
          id,
          name,
          status: "skipped",
          durationMs: Date.now() - started,
          message: "Test not configured",
        })
        return
      }
      results.push({
        id,
        name,
        status: "success",
        durationMs: Date.now() - started,
        message: payload.message,
        details: payload.details,
      })
    } catch (error) {
      const durationMs = Date.now() - started
      const message =
        error instanceof Error && error.message ? error.message : "Unexpected diagnostic failure"
      results.push({
        id,
        name,
        status: "error",
        durationMs,
        message,
        details:
          error instanceof Error
            ? { status: (error as { status?: number }).status ?? null, body: (error as { body?: unknown }).body ?? null }
            : null,
      })
    }
  }

  const registerConfig = request.register
  await runTest("register", "User registration", registerConfig
    ? async () => {
        const email = applyEmailTemplate(registerConfig.email)
        const url = resolveTargetUrl(baseUrl, "auth/register")
        const { data, response } = await sendJsonRequest(
          url,
          {
            name: registerConfig.name,
            email,
            password: registerConfig.password,
          },
          fetchImpl,
          cookieJar,
        )
        context.registeredEmail = email
        return {
          message:
            extractMessageFromPayload(data) || `Registration succeeded with status ${response.status}`,
          details: { status: response.status, data },
        }
      }
    : null)

  const loginConfig = request.login
  await runTest("login", "Login", loginConfig
    ? async () => {
        const url = resolveTargetUrl(baseUrl, "auth/login")
        const { data, response } = await sendJsonRequest(
          url,
          {
            email: loginConfig.email,
            password: loginConfig.password,
            remember: loginConfig.remember ?? true,
          },
          fetchImpl,
          cookieJar,
        )
        const token = extractTokenFromPayload(data)
        if (token) {
          context.loginToken = token
        }
        return {
          message: extractMessageFromPayload(data) || `Login succeeded with status ${response.status}`,
          details: { status: response.status, data },
        }
      }
    : null)

  await runTest("token", "Token generation", () => {
    //1.- Only validate the token when the login step produced a usable credential.
    if (!context.loginToken) {
      return null
    }
    return Promise.resolve({
      message: "Authentication token captured successfully",
      details: { token: context.loginToken },
    })
  })

  const verificationEmail = request.verification?.email || context.registeredEmail || context.loginEmail
  await runTest("verification", "Email verification dispatch", verificationEmail
    ? async () => {
        const url = resolveTargetUrl(baseUrl, "email/verification-notification")
        const { data, response } = await sendJsonRequest(
          url,
          { email: verificationEmail },
          fetchImpl,
          cookieJar,
        )
        return {
          message:
            extractMessageFromPayload(data) ||
            `Verification notification accepted with status ${response.status}`,
          details: { status: response.status, data, email: verificationEmail },
        }
      }
    : null)

  return {
    backend,
    results,
    context,
  }
}

