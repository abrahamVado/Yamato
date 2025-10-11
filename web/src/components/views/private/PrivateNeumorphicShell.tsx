"use client"

//1.- Provide a reusable neumorphic wrapper so every private view stays visually consistent.
import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PrivateNeumorphicShellProps = {
  //2.- Accept slot content plus optional class hooks so each view can fine-tune spacing.
  children: ReactNode
  testId?: string
  wrapperClassName?: string
  cardClassName?: string
}

export function PrivateNeumorphicShell({
  children,
  testId,
  wrapperClassName,
  cardClassName,
}: PrivateNeumorphicShellProps) {
  //3.- Stretch the wrapper to the viewport edges while keeping gentle gutters on every breakpoint.
  return (
    <div
      className={cn(
        "mx-auto flex w-full justify-center px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20",
        wrapperClassName,
      )}
    >
      <Card
        data-testid={testId}
        className={cn(
          "neumorphic-card w-full shadow-none px-6 py-6 md:px-8 md:py-8 lg:px-10 xl:max-w-[calc(100vw-6rem)] 2xl:max-w-[calc(100vw-8rem)]",
          cardClassName,
        )}
      >
        {children}
      </Card>
    </div>
  )
}

