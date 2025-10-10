"use client"

//1.- Import React utilities and the class name helper so we can merge caller styles elegantly.
import * as React from "react"
import { cn } from "@/lib/utils"

//2.- The textarea mirrors the shadcn/ui baseline styles while still accepting native props.
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }
