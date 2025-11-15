// src/components/ui/field.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type FieldProps = React.HTMLAttributes<HTMLDivElement>

export function Field({ className, ...props }: FieldProps) {
  return <div className={cn("space-y-1", className)} {...props} />
}

export type FieldGroupProps = React.HTMLAttributes<HTMLDivElement>

export function FieldGroup({ className, ...props }: FieldGroupProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 md:gap-5 w-full", className)}
      {...props}
    />
  )
}

export type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  )
}

export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

export function FieldDescription({
  className,
  ...props
}: FieldDescriptionProps) {
  return (
    <p
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export type FieldSeparatorProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Separator with a centered label.
 * Works with the class:
 *   *:data-[slot=field-separator-content]:bg-card
 * by putting `data-slot="field-separator-content"` on the label span.
 */
export function FieldSeparator({
  children,
  className,
  ...props
}: FieldSeparatorProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center text-xs text-muted-foreground uppercase tracking-wide",
        className,
      )}
      {...props}
    >
      <div className="h-px flex-1 bg-border" />
      <span
        data-slot="field-separator-content"
        className="mx-2 px-2 bg-background"
      >
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
