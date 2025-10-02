"use client";

const AUTH_TOKEN_STORAGE_KEY = "yamato.authToken";

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
  //1.- Build the headers, including the stored Bearer token when available.
  const headers = new Headers(init.headers);
  const token = getStoredToken();
  if (token && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${token}`);
  }

  //2.- Execute the network request using the provided arguments.
  const response = await fetch(input, { ...init, headers });

  //3.- Handle authentication errors by clearing credentials and redirecting.
  if (response.status === 401 || response.status === 419) {
    clearStoredToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Authentication required");
  }

  //4.- Parse the JSON payload for convenience in data hooks.
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
