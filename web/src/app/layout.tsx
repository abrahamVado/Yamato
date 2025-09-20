// src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"

// Your existing providers
import { ThemeProvider } from "@/components/providers/theme-provider"
import { I18nProvider } from "@/app/providers/I18nProvider"
import PageLoadOverlay from "@/components/PageLoadOverlay"

// NEW: notifications imports
import { AnnouncementBar } from "@/components/notifications/AnnouncementBar"
import { ToastsProvider } from "@/components/notifications/ToastsProvider"

export const metadata: Metadata = {
  title: "Yamato",
  description:
    "Yamato is a multi-tenant Next.js + shadcn/ui starter with RBAC, audit trails, and a retractable sidebar UX.",
  icons: { icon: "/favicon.svg" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider defaultLocale="en">
            {/* Optional global banner (dismissible, persisted in localStorage by id) */}
            <AnnouncementBar
              id="deploy-1800"
              message="We’ll deploy today at 18:00 (UTC-6). Expected blip: ~2 min."
              className="border-b"
            />

            {/* Global page loader overlay */}
            <PageLoadOverlay />

            {/* Your app content */}
            {children}

            {/* Toasts (Sonner) — keep at end of <body> */}
            <ToastsProvider />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
