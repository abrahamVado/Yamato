// src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { I18nProvider } from "@/app/providers/I18nProvider"
import PageLoadOverlay from "@/components/PageLoadOverlay"

export const metadata: Metadata = {
  title: "Yamato",
  description: "Yamato is a multi-tenant Next.js + shadcn/ui starter with RBAC, audit trails, and a retractable sidebar UX.",
  icons: { icon: "/favicon.svg" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider defaultLocale="en">
            {/* Global page loader overlay */}
            <PageLoadOverlay />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
