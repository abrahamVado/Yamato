/**
 * Small fetch wrapper for communicating with your backend API.  Reads
 * the base URL from environment variables (`VITE_API_URL` or
 * `NEXT_PUBLIC_API_URL`) and provides helper functions for GET and POST
 * requests.  Extend this module with PUT, DELETE or authentication as
 * needed.
 */

const API_BASE: string | undefined =
  // Vite style environment variables
  (import.meta as any).env?.VITE_API_URL ||
  // Fall back to Next.js style variables
  (typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL as string | undefined) : undefined);

if (!API_BASE) {
  console.warn('API base URL is not defined.  Set VITE_API_URL in your environment.');
}

/**
 * Performs a GET request to the given path and returns the parsed JSON.
 * Throws an error if the response is not OK or JSON cannot be parsed.
 */
export async function apiGet<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'include',
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API GET ${path} failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Performs a POST request with JSON body and returns the parsed JSON.  Use
 * this helper for sending data to your API.
 */
export async function apiPost<T = any>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'include',
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API POST ${path} failed with status ${res.status}`);
  }
  return res.json();
}