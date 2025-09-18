// src/app/not-found.tsx
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-6 py-16 text-center">
      {/* Illustration */}
      <div className="mb-8">
        <Image
          src="/cat_404.svg"             // <- or "/cat_logo.svg"
          alt="A curious cat looking for the missing page"
          width={280}
          height={280}
          priority
          className="opacity-90"
        />
        <span className="sr-only">404</span>
      </div>

      {/* Title & copy */}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
        The page you’re looking for doesn’t exist or might have been moved.
      </p>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/docs">
            <BookOpen className="mr-2 h-4 w-4" />
            View docs
          </Link>
        </Button>
      </div>

      {/* Subtle code mark */}
      <div className="mt-10 text-xs text-muted-foreground">
        <code>404</code>
      </div>
    </main>
  )
}
