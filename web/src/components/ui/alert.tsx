import * as React from 'react'
import { cn } from '../lib/utils'

export function Alert({ variant = 'default', className, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }) {
  return <div className={cn('alert', variant === 'destructive' ? 'alert-destructive' : 'border-gray-200', className)} {...props} />
}

export function AlertTitle(props: React.HTMLAttributes<HTMLDivElement>) { return <div className="font-semibold" {...props} /> }
export function AlertDescription(props: React.HTMLAttributes<HTMLDivElement>) { return <div className="text-sm" {...props} /> }
