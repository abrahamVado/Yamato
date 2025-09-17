"use client"
import * as React from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const current = (theme === "system" ? resolvedTheme : theme) ?? "light"
  const next = current === "dark" ? "light" : "dark"

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(next)}
            className="relative mr-2 h-8 w-8 rounded-full bg-background text-icon"
            aria-label="Switch theme"     // static
            title="Switch theme"          // static (prevents mismatch)
          >
            <SunIcon  className="h-[1.2rem] w-[1.2rem] text-icon-sun rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] text-icon-moon rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Switch theme</span>
          </Button>
        </TooltipTrigger>
        {/* dynamic text lives in client-only tooltip content */}
        <TooltipContent side="bottom">Switch theme ({current} → {next})</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
