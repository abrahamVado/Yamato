// src/components/public/PublicHeader.tsx
"use client"

import * as React from "react"
import { BrandLink } from "@/components/shared/Brand"
import { PublicNavRight } from "@/components/public/PublicNav"
import { NotificationsBell } from "@/components/notifications/NotificationsBell"

export function PublicHeader() {
  return (
    <header className="topbar">
      <div className="topbar-inner justify-between">
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
