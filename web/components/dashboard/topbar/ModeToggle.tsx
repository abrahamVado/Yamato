"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "@/components/icons"

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const next = theme === "dark" ? "light" : "dark"
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(next)}>
      <Sun className="h-5 w-5 rotate-0 dark:-rotate-90 transition" />
      <Moon className="absolute h-5 w-5 rotate-90 dark:rotate-0 transition" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
