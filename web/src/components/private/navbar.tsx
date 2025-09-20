// src/components/admin-panel/navbar-example.tsx
"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/private/user-nav"
import { SheetMenu } from "@/components/private/sheet-menu"
import { NavActions } from "@/components/private/nav-actions"
import { LanguageToggle } from "@/components/language-toggle"

// NEW: in-app notifications bell
import { NotificationsBell } from "@/components/notifications/NotificationsBell"

interface NavbarProps {
  title: string
  showPublicLinks?: boolean
  includeLoginLink?: boolean
}

export function Navbar({
  title,
  showPublicLinks = false,
  includeLoginLink = false,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center gap-3">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Notifications bell (sheet opens on click) */}
          <NotificationsBell />

          {/* Your existing quick links/widgets */}
          <NavActions inboxHref="/messages" chatHref="/chat" inboxCount={3} chatCount={1} />

          <LanguageToggle />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
