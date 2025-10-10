"use client";

const AUTH_TOKEN_STORAGE_KEY = "yamato.authToken";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
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
  const trimmedBase = baseUrl.trim();
  if (!trimmedBase) {
    return false;
  }
  try {
    //2.- Prefer the straightforward absolute URL comparison when the string parses cleanly.
    const backend = new URL(trimmedBase);
    if (backend.origin === "null") {
      return true;
    }
    return backend.origin !== window.location.origin;
  } catch {
    try {
      //3.- Fall back to resolving the base against the current origin so relative inputs still proxy.
      const resolved = new URL(trimmedBase, window.location.origin);
      return resolved.origin !== window.location.origin;
    } catch {
      //4.- Default to proxying when parsing fails entirely to avoid cross-origin fetch attempts.
      return true;
    }
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

function collapseSameOriginBase(baseUrl: string, normalizedPath: string): string | null {
  //1.- Detect the browser runtime so we can attempt to trim same-origin URLs down to path-only strings.
  if (typeof window === "undefined") {
    return null;
  }
  try {
    //2.- Resolve the configured base against the current origin to support both absolute and relative inputs.
    const resolvedBase = new URL(baseUrl, window.location.origin);
    if (resolvedBase.origin !== window.location.origin) {
      return null;
    }
    //3.- Join the pathname and target while preventing duplicate slashes so fetch receives "/api/..." values.
    const basePath = resolvedBase.pathname.replace(/\/+$/, "");
    const joinedPath = normalizedPath ? `${basePath}/${normalizedPath}` : basePath;
    if (!joinedPath) {
      return "/";
    }
    return joinedPath.startsWith("/") ? joinedPath : `/${joinedPath}`;
  } catch {
    return null;
  }
}

type ResolvedPath = {
  url: string;
  normalizedPath: string;
  usedProxy: boolean;
};

function joinWithBase(path: string): ResolvedPath {
  const normalizedPath = path.replace(/^\/+/, "");
  if (!API_BASE_URL) {
    //1.- When no base URL is configured defer to the caller-provided path and remember the normalized segments.
    return { url: path, normalizedPath, usedProxy: false };
  }

  if (
    shouldProxyBrowserRequests(API_BASE_URL) &&
    normalizedPath &&
    !normalizedPath.startsWith(PROXY_PREFIX.replace(/^\/+/, ""))
  ) {
    //2.- Route browser requests through the Next.js proxy to avoid cross-origin failures during local development.
    return { url: buildProxyPath(normalizedPath), normalizedPath, usedProxy: true };
  }

  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  const sameOriginPath = collapseSameOriginBase(trimmedBase, normalizedPath);
  if (sameOriginPath) {
    //3.- Collapse same-origin targets down to relative paths so fetch receives "/api/..." inputs.
    return { url: sameOriginPath, normalizedPath, usedProxy: false };
  }

  const url = normalizedPath ? `${trimmedBase}/${normalizedPath}` : trimmedBase;
  //4.- Fall back to the fully-qualified backend URL when proxying is unnecessary.
  return { url, normalizedPath, usedProxy: false };
}

type ResolvedRequest = {
  info: RequestInfo;
  normalizedPath: string | null;
  usedProxy: boolean;
};

function resolveRequestInput(input: RequestInfo): ResolvedRequest {
  //1.- Apply the base URL when the caller passes a relative string while leaving absolute URLs untouched.
  if (typeof input === "string") {
    const { url, normalizedPath, usedProxy } = joinWithBase(input);
    let resolvedUrl = url;
    if (resolvedUrl && !isAbsoluteUrl(resolvedUrl) && !resolvedUrl.startsWith("/")) {
      resolvedUrl = `/${resolvedUrl}`;
    }
    if (!resolvedUrl) {
      resolvedUrl = normalizedPath ? `/${normalizedPath}` : "/";
    }
    return { info: resolvedUrl, normalizedPath, usedProxy };
  }
  if (typeof URL !== "undefined" && input instanceof URL) {
    return { info: input, normalizedPath: null, usedProxy: false };
  }
  if (typeof Request !== "undefined" && input instanceof Request) {
    const url = input.url;
    if (isAbsoluteUrl(url) || !API_BASE_URL) {
      return { info: input, normalizedPath: null, usedProxy: false };
    }
    const { url: joinedUrl, normalizedPath, usedProxy } = joinWithBase(url);
    const finalUrl = isAbsoluteUrl(joinedUrl) || joinedUrl.startsWith("/") ? joinedUrl : `/${joinedUrl}`;
    return { info: new Request(finalUrl, input), normalizedPath, usedProxy };
  }
  return { info: input, normalizedPath: null, usedProxy: false };
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
  const { info: resolvedRequest, normalizedPath, usedProxy } = resolveRequestInput(input);
  let resolvedInput = resolvedRequest;
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

  let response: Response;
  try {
    //5.- Execute the network request using the provided arguments.
    response = await fetch(resolvedInput, { ...init, headers, credentials });
  } catch (error) {
    if (typeof window === "undefined" || !API_BASE_URL || !normalizedPath || usedProxy || typeof resolvedInput !== "string") {
      throw error;
    }
    try {
      //6.- Retry through the proxy when browser fetches fail (e.g., due to CORS) so the request stays same-origin.
      const fallbackTarget = buildProxyPath(normalizedPath);
      response = await fetch(fallbackTarget, { ...init, headers, credentials });
    } catch {
      throw error;
    }
  }

  //7.- Handle authentication errors by clearing credentials and redirecting.
  if (response.status === 401 || response.status === 419) {
    clearStoredToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Authentication required");
  }

  //8.- Read the raw body so we can gracefully handle empty responses such as 204 logout acknowledgements.
  const rawBody = await response.text();
  const hasBody = rawBody.trim().length > 0;
  let data: unknown = null;
  if (hasBody) {
    const contentType = response.headers.get("content-type") ?? "";
    //9.- Parse JSON payloads while falling back to plain text when Laravel responds with strings.
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
    //10.- Attach the status code and parsed body so callers can surface validation errors verbatim.
    const error = new Error((data as { message?: string } | null)?.message ?? "Request failed") as Error & {
      status?: number;
      body?: unknown;
    };
    error.status = response.status;
    error.body = data;
    throw error;
  }

  //11.- Return the parsed payload when available while maintaining the generic signature for callers expecting JSON.
  return data as T;
}

export async function apiMutation<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  //1.- Reuse apiRequest to maintain consistent error handling for mutations.
  return apiRequest<T>(input, init);
}
