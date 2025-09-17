import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"

export const metadata: Metadata = {
  title: "Yamato",
  description: "Yamato is a multi-tenant Next.js + shadcn/ui starter with RBAC, audit trails, and a retractable sidebar UX. Build secure dashboards your customers love—without wiring the basics.",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
