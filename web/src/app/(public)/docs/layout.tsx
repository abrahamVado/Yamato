// src/app/(public)/docs/layout.tsx
import * as React from "react"
import DocsSidebar from "@/components/docs/sidebar"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <DocsSidebar />

        {/* Content */}
        <div className="prose max-w-none dark:prose-invert">
          {children}
        </div>
      </div>
    </main>
  )
}
