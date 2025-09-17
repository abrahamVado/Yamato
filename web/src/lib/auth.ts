import { cookies } from "next/headers"
import type { Role } from "@/lib/rbac"
export type YamatoUser = { id: string; name: string; email: string; role: Role }
export async function getSessionUser(): Promise<YamatoUser | null> {
  const c = (await cookies()).get("yamato_session")?.value; if (!c) return null
  try { return JSON.parse(Buffer.from(c, "base64").toString("utf8")) as YamatoUser } catch { return null }
}
export function makeSessionCookie(user: YamatoUser) { return Buffer.from(JSON.stringify(user), "utf8").toString("base64") }
