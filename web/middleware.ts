import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isPrivate = req.nextUrl.pathname.startsWith("/(private)")
  const loggedIn = req.cookies.get("yamato_auth")?.value === "1" // stub

  if (isPrivate && !loggedIn) {
    const url = req.nextUrl.clone()
    url.pathname = "/(public)/login"
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/(private)(.*)"],
}
