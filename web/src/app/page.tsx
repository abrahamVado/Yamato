import { Button } from "@/components/ui/button"
import Link from "next/link"
import SiteHeader from "@/components/site-header"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="relative py-20 flex-1">
        <div className="container max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Yamato — build SaaS <span className="text-primary">fast</span>.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Next.js app starter with shadcn-style UI, Tailwind, and a ready dashboard shell.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild><Link href="/register">Get started</Link></Button>
            <Button asChild variant="outline"><Link href="/docs">Read the docs</Link></Button>
          </div>
        </div>
      </section>
      <footer className="border-t text-xs text-muted-foreground p-4 text-center">© Yamato</footer>
    </div>
  )
}
