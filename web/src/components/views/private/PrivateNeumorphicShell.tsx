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
  //3.- Center the neumorphic card and merge custom classes without sacrificing the soft aesthetic.
  return (
    <div className={cn("flex justify-center", wrapperClassName)}>
      <Card
        data-testid={testId}
        className={cn(
          "neumorphic-card w-full max-w-6xl shadow-none px-6 py-6 md:px-8 md:py-8 lg:px-10",
          cardClassName,
        )}
      >
        {children}
      </Card>
    </div>
  )
}

