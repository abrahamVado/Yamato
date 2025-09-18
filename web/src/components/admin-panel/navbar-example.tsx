// src/components/admin-panel/navbar-example.tsx
"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/admin-panel/user-nav"
import { SheetMenu } from "@/components/admin-panel/sheet-menu"
import { NavActions } from "@/components/admin-panel/nav-actions"
import { LanguageSelector } from "@/components/admin-panel/language-selector"

interface NavbarProps { title: string }

export function NavbarExample({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center gap-3">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <NavActions inboxHref="/messages" chatHref="/chat" inboxCount={3} chatCount={1} />
          <LanguageSelector />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
