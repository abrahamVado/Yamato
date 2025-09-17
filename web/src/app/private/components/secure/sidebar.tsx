"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FiHome, FiUsers, FiLayers, FiKey, FiPackage, FiShield, FiSettings, FiUser
} from "react-icons/fi"

const NAV = [
  { href: "/dashboard", icon: FiHome,    label: "Dashboard" },
  { href: "/users",     icon: FiUsers,   label: "Users" },
  { href: "/teams",     icon: FiLayers,  label: "Teams" },
  { href: "/roles",     icon: FiKey,     label: "Roles & Permissions" },
  { href: "/modules",   icon: FiPackage, label: "Modules" },
  { href: "/security",  icon: FiShield,  label: "Security" },
  { href: "/settings",  icon: FiSettings,label: "Settings" },
  { href: "/profile",   icon: FiUser,    label: "My Profile" },
] as const

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 xl:w-80 flex-col border-r bg-card">
      <div className="h-14 border-b flex items-center px-4 font-semibold">Yamato</div>
      <ScrollArea className="flex-1 p-2">
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent", active && "bg-accent text-accent-foreground")}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="p-3 text-xs text-muted-foreground">v0.1.0 • Sidebar</div>
    </aside>
  )
}
