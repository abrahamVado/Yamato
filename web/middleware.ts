import { NextResponse, NextRequest } from "next/server"
const PRIVATE_PREFIXES = ["/dashboard","/users","/teams","/roles","/profile","/settings","/modules","/security"]
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!PRIVATE_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next()
  const sess = req.cookies.get("yamato_session")?.value
  if (!sess) { const url = req.nextUrl.clone(); url.pathname = "/login"; url.searchParams.set("from", pathname); return NextResponse.redirect(url) }
  return NextResponse.next()
}
export const config = { matcher: ["/dashboard/:path*","/users/:path*","/teams/:path*","/roles/:path*","/profile/:path*","/settings/:path*","/modules/:path*","/security/:path*"] }
