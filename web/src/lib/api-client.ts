"use client";

const AUTH_TOKEN_STORAGE_KEY = "yamato.authToken";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PROXY_PREFIX = "/api/proxy";

function isAbsoluteUrl(url: string): boolean {
  //1.- Detect whether the provided string already includes a scheme so we avoid prefixing it.
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function shouldProxyBrowserRequests(baseUrl: string): boolean {
  //1.- Bail out when running on the server where CORS rules do not apply.
  if (typeof window === "undefined") {
    return false;
  }
  //2.- Compare the configured backend origin against the current page origin.
  try {
    const backend = new URL(baseUrl);
    return backend.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function buildProxyPath(path: string): string {
  //1.- Remove any leading slash so the catch-all route receives clean segments.
  const trimmedPath = path.replace(/^\/+/, "");
  if (!trimmedPath) {
    return PROXY_PREFIX;
  }
  return `${PROXY_PREFIX}/${trimmedPath}`;
}

function joinWithBase(path: string): string {
  //1.- Normalize the configured base URL and join it with the relative path while preventing duplicate slashes.
  if (!API_BASE_URL || !path) {
    return path;
  }
  const normalizedPath = path.replace(/^\/+/, "");
  if (shouldProxyBrowserRequests(API_BASE_URL) && !normalizedPath.startsWith(PROXY_PREFIX.replace(/^\/+/, ""))) {
    //2.- Route browser requests through the Next.js proxy to avoid cross-origin failures during local development.
    return buildProxyPath(normalizedPath);
  }
  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  if (!normalizedPath) {
    return trimmedBase;
  }
  return `${trimmedBase}/${normalizedPath}`;
}

function resolveRequestInput(input: RequestInfo): RequestInfo {
  //1.- Apply the base URL when the caller passes a relative string while leaving absolute URLs untouched.
  if (typeof input === "string") {
    return isAbsoluteUrl(input) ? input : joinWithBase(input);
  }
  if (typeof URL !== "undefined" && input instanceof URL) {
    return input;
  }
  if (typeof Request !== "undefined" && input instanceof Request) {
    const url = input.url;
    if (isAbsoluteUrl(url) || !API_BASE_URL) {
      return input;
    }
    const resolvedUrl = joinWithBase(url);
    return new Request(resolvedUrl, input);
  }
  return input;
}

export function getStoredToken(): string | null {
  //1.- Safely read the stored auth token when running in the browser.
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function clearStoredToken() {
  //1.- Remove the persisted token so future requests are forced to re-authenticate.
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string) {
  //1.- Persist the provided token for subsequent authenticated requests.
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export async function apiRequest<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  //1.- Resolve the request target so relative paths respect the configured API base URL.
  let resolvedInput = resolveRequestInput(input);
  if (typeof resolvedInput === "string" && !isAbsoluteUrl(resolvedInput) && !resolvedInput.startsWith("/")) {
    //2.- Default relative strings to root-based paths when no base URL is configured.
    resolvedInput = `/${resolvedInput}`;
  }
  //3.- Build the headers, including the stored Bearer token when available.
  const headers = new Headers(init.headers);
  const token = getStoredToken();
  if (token && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${token}`);
  }
  //4.- Always forward cookies to the Laravel backend so Sanctum session state is preserved.
  const credentials: RequestCredentials = init.credentials ?? "include";

  //5.- Execute the network request using the provided arguments.
  const response = await fetch(resolvedInput, { ...init, headers, credentials });

  //6.- Handle authentication errors by clearing credentials and redirecting.
  if (response.status === 401 || response.status === 419) {
    clearStoredToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Authentication required");
  }

  //7.- Read the raw body so we can gracefully handle empty responses such as 204 logout acknowledgements.
  const rawBody = await response.text();
  const hasBody = rawBody.trim().length > 0;
  let data: unknown = null;
  if (hasBody) {
    const contentType = response.headers.get("content-type") ?? "";
    //8.- Parse JSON payloads while falling back to plain text when Laravel responds with strings.
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        data = rawBody;
      }
    } else {
      data = rawBody;
    }
  }

  if (!response.ok) {
    //9.- Attach the status code and parsed body so callers can surface validation errors verbatim.
    const error = new Error((data as { message?: string } | null)?.message ?? "Request failed") as Error & {
      status?: number;
      body?: unknown;
    };
    error.status = response.status;
    error.body = data;
    throw error;
  }

  //10.- Return the parsed payload when available while maintaining the generic signature for callers expecting JSON.
  return data as T;
}

export async function apiMutation<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  //1.- Reuse apiRequest to maintain consistent error handling for mutations.
  return apiRequest<T>(input, init);
}
