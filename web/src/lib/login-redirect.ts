//1.- Centralize the logic for resolving where a freshly authenticated user should be redirected.
export const POST_LOGIN_FALLBACK_ROUTE = "/private/dashboard";

export function resolvePostLoginRedirect(fromParam: string | null | undefined): string {
  //2.- Bail out early when the caller did not provide a usable destination.
  if (!fromParam) {
    return POST_LOGIN_FALLBACK_ROUTE;
  }

  const normalized = fromParam.trim();
  //3.- Accept only absolute, on-site paths that remain inside the private area.
  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return POST_LOGIN_FALLBACK_ROUTE;
  }
  if (!normalized.startsWith("/private")) {
    return POST_LOGIN_FALLBACK_ROUTE;
  }

  return normalized;
}
