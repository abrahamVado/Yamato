// src/components/admin-panel/nav-actions.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mail, MessageSquareText } from "lucide-react"

type NavActionsProps = {
  inboxHref?: string
  chatHref?: string
  inboxCount?: number
  chatCount?: number
  onInboxClick?: () => void
  onChatClick?: () => void
  showLabels?: boolean
}

function CountBadge({ value }: { value?: number }) {
  if (!value || value <= 0) return null
  return (
    <span
      className="absolute -right-1.5 -top-1.5 inline-flex min-w-[18px] h-[18px] items-center justify-center
                 rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground
                 ring-1 ring-background"
      aria-label={`${value} unread`}
    >
      {value > 99 ? "99+" : value}
    </span>
  )
}

function IconBtn({
  label,
  children,
  onClick,
  href,
}: {
  label: string
  children: React.ReactNode
  onClick?: () => void
  href?: string
}) {
  const btn = (
    <Button variant="ghost" size="icon" className="relative">
      {children}
    </Button>
  )

  if (href) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href} aria-label={label} className="relative">
              {btn}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span onClick={onClick} role="button" aria-label={label} className="relative">
            {btn}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function NavActions({
  inboxHref,
  chatHref,
  inboxCount = 0,
  chatCount = 0,
  onInboxClick,
  onChatClick,
  showLabels = false,
}: NavActionsProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div className="relative">
        <IconBtn label="Messages" href={inboxHref} onClick={onInboxClick}>
          <Mail className="h-5 w-5" />
          <CountBadge value={inboxCount} />
        </IconBtn>
        {showLabels && <span className="ml-1 hidden md:inline text-xs">Messages</span>}
      </div>

      <div className="relative">
        <IconBtn label="Chat" href={chatHref} onClick={onChatClick}>
          <MessageSquareText className="h-5 w-5" />
          <CountBadge value={chatCount} />
        </IconBtn>
        {showLabels && <span className="ml-1 hidden md:inline text-xs">Chat</span>}
      </div>
    </div>
  )
}
