"use client"

import Link from "next/link"
import Image from "next/image"
import * as React from "react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/app/providers/I18nProvider"
import { LanguageToggle } from "@/components/language-toggle"
import { ModeToggle } from "@/components/mode-toggle"

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`hover:text-primary ${active ? "text-primary font-medium" : ""}`}
    >
      {children}
    </Link>
  )
}

export function PublicHeader() {
  const { t } = useI18n()

  return (
    <header className="w-full border-b bg-background px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left: logo/brand */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
          <span>{t("brand")}</span>
        </Link>

        {/* Right: nav + controls */}
        <nav className="flex items-center gap-4 text-sm">
          {/* Use root URLs; your rewrites will map them to /public/... */}
          <NavLink href="/docs">{t("nav.docs")}</NavLink>
          <NavLink href="/register">{t("nav.register")}</NavLink>
          <NavLink href="/login">{t("nav.login")}</NavLink>

          {/* Toggles */}
          <LanguageToggle />
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
