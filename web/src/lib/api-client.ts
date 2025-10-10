"use client";

const AUTH_TOKEN_STORAGE_KEY = "yamato.authToken";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function isAbsoluteUrl(url: string): boolean {
  //1.- Detect whether the provided string already includes a scheme so we avoid prefixing it.
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function joinWithBase(path: string): string {
  //1.- Normalize the configured base URL and join it with the relative path while preventing duplicate slashes.
  if (!API_BASE_URL || !path) {
    return path;
  }
  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  if (!trimmedPath) {
    return trimmedBase;
  }
  return `${trimmedBase}/${trimmedPath}`;
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

  //4.- Execute the network request using the provided arguments.
  const response = await fetch(resolvedInput, { ...init, headers });

  //5.- Handle authentication errors by clearing credentials and redirecting.
  if (response.status === 401 || response.status === 419) {
    clearStoredToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Authentication required");
  }

  //6.- Parse the JSON payload for convenience in data hooks.
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }
  return data as T;
}

export async function apiMutation<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  //1.- Reuse apiRequest to maintain consistent error handling for mutations.
  return apiRequest<T>(input, init);
}
