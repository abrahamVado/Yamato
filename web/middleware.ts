// middleware.ts (project root)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Locales you support
const LOCALES = ["en", "es", "pt", "zh", "ja"] as const;
const DEFAULT_LOCALE = "en";

// Paths that require an authenticated session (after the locale segment)
const PRIVATE_PREFIXES = [
  "dashboard",
  "users",
  "teams",
  "roles",
  "profile",
  "settings",
  "modules",
  "security"
];

// Public auth routes (don’t guard these)
const PUBLIC_AUTH_PATHS = [
  "auth/login",
  "auth/register",
  "login",
  "register"
];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Ignore assets & API
  if (pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Split path and detect locale
  const segments = pathname.split("/").filter(Boolean);            // e.g. ['en','dashboard','...'] | ['dashboard']
  const hasLocale = segments.length > 0 && LOCALES.includes(segments[0] as any);
  const locale = hasLocale ? segments[0] : DEFAULT_LOCALE;
  const rest = hasLocale ? "/" + segments.slice(1).join("/") : pathname; // path after locale, e.g. '/dashboard'

  // 1) Enforce locale prefix
  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  // 2) Auth guard for private areas (locale-aware)
  const isPrivate = PRIVATE_PREFIXES.some(p => rest === `/${p}` || rest.startsWith(`/${p}/`));
  const isPublicAuth = PUBLIC_AUTH_PATHS.some(p => rest === `/${p}` || rest.startsWith(`/${p}/`));

  if (isPrivate && !isPublicAuth) {
    const sess = req.cookies.get("yamato_session")?.value;
    if (!sess) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/auth/login`;                      // keep auth inside the same locale
      url.searchParams.set("from", pathname + (search || ""));     // preserve the original target
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except next assets, images, and API
  matcher: ["/((?!_next|.*\\..*|api).*)"]
};
