// src/app/(public)/docs/layout.tsx
import * as React from "react"
import DocsSidebar from "@/components/docs/sidebar"
import { Card } from "@/components/ui/card"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    //1.- Provide a responsive outer shell that centers the docs view with balanced padding.
    <main className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-8">
      {/*2.- Retain the sidebar and content grid so navigation remains aligned on larger screens.*/}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_minmax(0,1fr)]">
        {/*3.- Surface the persistent documentation navigation menu.*/}
        <DocsSidebar />

        {/*4.- Wrap documentation pages in a card to prevent the prose from stretching across ultra-wide layouts.*/}
        <div className="flex justify-center md:justify-start">
          <Card
            data-testid="docs-content-card"
            className="neumorphic-card w-full max-w-3xl shadow-none"
          >
            <div className="prose max-w-none dark:prose-invert px-6 py-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
