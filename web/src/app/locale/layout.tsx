import type { Metadata } from "next"
import "../globals.css"
import { I18nProvider } from "@/app/providers/I18nProvider"

export const metadata: Metadata = {
  title: "Yamato",
  description: "Yamato Enterprise",
}

async function getDict(locale: string) {
  try {
    // your /lang/*.json
    const dict = (await import(`@/lang/${locale}.json`)).default
    return dict
  } catch {
    const dict = (await import("@/lang/en.json")).default
    return dict
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const dict = await getDict(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        {/* Provide both the current locale and its dictionary to the app */}
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
