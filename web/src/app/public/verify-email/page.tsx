"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const sp = useSearchParams()
  const email = sp.get("email") || "your@email.com"
  return (
    <div className="container max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold">Verify your email</h1>
      <p className="mt-2 text-muted-foreground">We sent a verification link to <span className="font-medium">{email}</span>.</p>
      <div className="mt-6"><Button asChild><Link href="/login">Back to login</Link></Button></div>
    </div>
  )
}
