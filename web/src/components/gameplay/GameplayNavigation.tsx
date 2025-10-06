"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/gameplay/world", label: "World explorer" },
  { href: "/gameplay/vehicles", label: "Vehicle gallery" },
]

export function GameplayNavigation() {
  const pathname = usePathname()

  //1.- Highlight the active route so explorers always know which surface they are visiting.
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map(link => {
        const isActive = pathname === link.href
        //2.- Toggle emphasis via Tailwind utilities based on the current route.
        const base = "rounded-full border px-4 py-2 text-sm transition"
        const active = "border-primary bg-primary/10 text-primary"
        const inactive = "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
        return (
          <Link key={link.href} href={link.href} className={`${base} ${isActive ? active : inactive}`}>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
