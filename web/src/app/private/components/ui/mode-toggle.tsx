"use client"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { FiSun, FiMoon } from "react-icons/fi"
export default function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </Button>
  )
}
