import { NextRequest, NextResponse } from "next/server"
import { makeSessionCookie } from "@/lib/auth"
export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: "Missing" }, { status: 400 })
  const role = email.startsWith("admin") ? "admin" : email.startsWith("manager") ? "manager" : "member"
  const user = { id: "u1", name: "Yamato User", email, role }
  const res = NextResponse.json({ ok: true })
  res.cookies.set("yamato_session", makeSessionCookie(user as any), { httpOnly: true, path: "/", sameSite: "lax", maxAge: 60*60*24*7 })
  return res
}
