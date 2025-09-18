// src/components/public/NavLink.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`nav-link ${active ? "nav-link-active" : ""}`}
    >
      {children}
    </Link>
  )
}
