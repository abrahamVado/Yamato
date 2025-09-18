// src/components/public/PublicHeader.tsx
"use client"

import * as React from "react"
import { BrandLink } from "@/components/shared/Brand"
import { PublicNavRight } from "@/components/public/PublicNav"

export function PublicHeader() {
  return (
    <header className="topbar">
      <div className="topbar-inner justify-between">
        <BrandLink />
        <PublicNavRight />
      </div>
    </header>
  )
}
