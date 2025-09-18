// src/components/public/PublicNav.tsx
"use client"

import * as React from "react"
import { NavLink } from "@/components/public/NavLink"
import { LanguageToggle } from "@/components/language-toggle"
import { ModeToggle } from "@/components/mode-toggle"

/** Only the links that appear on the public navbar. */
export function PublicNavLinks({
  includeLogin = true,
  className = "nav-links flex items-center gap-4",
}: {
  includeLogin?: boolean
  className?: string
}) {
  return (
    <nav className={className}>
      <NavLink href="/docs">Docs</NavLink>
      <NavLink href="/register">Register</NavLink>
      {includeLogin && <NavLink href="/login">Login</NavLink>}
    </nav>
  )
}

/** The exact theme/language toggles used on the public navbar. */
export function PublicNavToggles({
  className = "flex items-center gap-2",
}: {
  className?: string
}) {
  return (
    <div className={className}>
      <LanguageToggle />
      <ModeToggle />
    </div>
  )
}

/** Convenience cluster that mirrors the public header’s right side. */
export function PublicNavRight({
  includeLogin = true,
  className = "ml-auto flex items-center gap-4",
}: {
  includeLogin?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <PublicNavLinks includeLogin={includeLogin} />
      <PublicNavToggles />
    </div>
  )
}
