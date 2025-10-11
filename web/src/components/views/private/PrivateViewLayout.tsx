"use client"

//1.- Import the shared content layout so private screens reuse the dashboard header and container spacing.
import { ContentLayout } from "@/components/admin-panel/content-layout"
import type { ReactNode } from "react"

type PrivateViewLayoutProps = {
  title: string
  children: ReactNode
}

export function PrivateViewLayout({ title, children }: PrivateViewLayoutProps) {
  //2.- Render the navbar-driven layout and keep a consistent grid wrapper for every private module.
  return (
    <ContentLayout title={title}>
      <div className="grid gap-6">{children}</div>
    </ContentLayout>
  )
}
