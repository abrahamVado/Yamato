// src/components/admin-panel/navbar-example.tsx
"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/admin-panel/user-nav"
import { SheetMenu } from "@/components/admin-panel/sheet-menu"
import { NavActions } from "@/components/admin-panel/nav-actions"

// ✅ use the SAME language toggle as the public header
import { LanguageToggle } from "@/components/language-toggle"

// (Optional) if you want the same Docs/Register(/Login) links from public nav
// create PublicNav.tsx as shown earlier, or import your existing NavLink trio here.
// import { PublicNavLinks } from "@/components/public/PublicNav"

interface NavbarProps {
  title: string
  showPublicLinks?: boolean
  includeLoginLink?: boolean // forwards to PublicNavLinks if you enable it
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
          {/* If you want the same public links, uncomment below and ensure PublicNavLinks exists */}
          {/* {showPublicLinks && (
            <PublicNavLinks
              includeLogin={includeLoginLink}
              className="hidden md:flex items-center gap-4 mr-2"
            />
          )} */}

          <NavActions inboxHref="/messages" chatHref="/chat" inboxCount={3} chatCount={1} />
          <LanguageToggle />  {/* ← SAME component as public header */}
          <ModeToggle />      {/* ← SAME theme toggle */}
          <UserNav />
        </div>
      </div>
    </header>
  )
}
