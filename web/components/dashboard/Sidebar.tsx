"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { navItems } from "@/lib/nav"
import clsx from "clsx"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="h-dvh w-[260px]">
      <div className="h-16 flex items-center gap-2 px-4">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary font-bold">Y</div>
        <span className="font-semibold">Yamato</span>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100dvh-4rem)] px-2">
        <nav className="p-2 space-y-1">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
