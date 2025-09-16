"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PublicNavbar() {
  return (
    <header className="h-16 border-b bg-background">
      <div className="mx-auto max-w-6xl h-full px-4 flex items-center justify-between">
        <Link href="/(public)/landing" className="font-semibold">Yamato</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/(public)/docs">Documentation</Link>
          <Link href="/(public)/login">Login</Link>
          <Button asChild size="sm"><Link href="/(public)/register">Get started</Link></Button>
        </nav>
      </div>
    </header>
  )
}
