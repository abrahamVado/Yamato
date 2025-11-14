// src/components/public/PublicHeader.tsx
"use client"

import * as React from "react"
import { BrandLink } from "@/components/shared/Brand"
import { PublicNavRight } from "@/components/public/PublicNav"
import { NotificationsBell } from "@/components/notifications/NotificationsBell"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-4 flex h-14 w-full items-center justify-between sm:mx-8">
        {/* //1.- Anchor the brand on the left with the same spacing rhythm as the landing page. */}
        <BrandLink />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <PublicNavRight />
        </div>
      </div>
    </header>
  )
}
