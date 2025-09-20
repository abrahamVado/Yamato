import * as React from 'react'
import { cn } from '../lib/utils'

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('progress', className)}>
      <div className="h-full bg-blue-600" style={{ width: pct + '%' }} />
    </div>
  )
}
