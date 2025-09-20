// src/components/admin-panel/navbar-admin.tsx
"use client"

import * as React from "react"
import { SheetMenu } from "@/components/private/sheet-menu"
import { UserNav } from "@/components/private/user-nav"
import { NavActions } from "@/components/private/nav-actions"
import { BrandLink } from "@/components/shared/Brand"

// ⬇️ Import the exact same components used by the public header
import { PublicNavLinks, PublicNavToggles } from "@/components/public/PublicNav"

export interface NavbarAdminProps {
  title?: string
  showPublicLinks?: boolean
  includeLoginLink?: boolean // forward to PublicNavLinks
}

export function NavbarAdmin({
  title = "Dashboard",
  showPublicLinks = false,
  includeLoginLink = false,
}: NavbarAdminProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner w-full">
        <div className="flex items-center gap-3">
          <SheetMenu />
          <BrandLink />
          {title && (
            <span className="ml-3 text-sm font-medium text-muted-foreground">/ {title}</span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {showPublicLinks && (
            <PublicNavLinks
              includeLogin={includeLoginLink}
              className="hidden md:flex items-center gap-4 mr-2"
            />
          )}

          <NavActions inboxHref="/messages" chatHref="/chat" inboxCount={0} chatCount={0} />

          {/* EXACT same toggles as public header */}
          <PublicNavToggles />

          <UserNav />
        </div>
      </div>
    </header>
  )
}
