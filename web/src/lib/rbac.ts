export type Role = "admin" | "manager" | "member"
export type Permission =
  | "users.read" | "users.write"
  | "teams.read" | "teams.write"
  | "roles.read" | "roles.write"
  | "modules.read" | "modules.write"
  | "settings.read" | "settings.write"
  | "security.read" | "security.write"
export const ROLE_PERMS: Record<Role, Permission[]> = {
  admin: ["users.read","users.write","teams.read","teams.write","roles.read","roles.write","modules.read","modules.write","settings.read","settings.write","security.read","security.write"],
  manager: ["users.read","teams.read","teams.write","modules.read","modules.write","settings.read"],
  member: ["modules.read","settings.read"]
}
export function can(role: Role, perm: Permission) { return ROLE_PERMS[role]?.includes(perm) ?? false }
