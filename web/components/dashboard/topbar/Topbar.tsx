"use client"

import ModeToggle from "./ModeToggle"
import MobileSidebar from "../mobile/MobileSidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Topbar() {
  return (
    <header className="h-16 border-b bg-background px-3 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <div className="text-sm text-muted-foreground hidden md:block">
          Public / Private / <span className="text-foreground font-medium">Dashboard</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://i.pravatar.cc/40?img=3" />
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
