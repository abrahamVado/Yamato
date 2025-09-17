import Link from "next/link"
import ModeToggle from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link href="/" className="font-semibold">Yamato</Link>
        <nav className="ml-6 hidden gap-6 md:flex">
          <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
          <Button asChild><Link href="/register">Sign up</Link></Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
