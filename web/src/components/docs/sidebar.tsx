// src/components/docs/sidebar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { docsNav } from "./nav"

function cn(...xs: Array<string | boolean | undefined | null>) {
  return xs.filter(Boolean).join(" ")
}

export default function DocsSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setOpen(false) // close on route change
  }, [pathname])

  return (
    <>
      {/* Mobile toggle */}
      <div className="mb-4 md:hidden">
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          {open ? "Hide menu" : "Show menu"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "md:sticky md:top-20 md:block",
          open ? "block" : "hidden md:block"
        )}
      >
        <nav className="space-y-8">
          {docsNav.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.links.map((link) => {
                  const active = pathname === link.href
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block rounded px-2 py-1.5 text-sm transition",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
