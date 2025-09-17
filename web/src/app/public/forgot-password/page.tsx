"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  async function onSubmit(e: React.FormEvent) { e.preventDefault(); alert("If this email exists, we sent reset instructions.") }
  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold">Recover password</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <Button className="w-full" type="submit">Send reset link</Button>
      </form>
    </div>
  )
}
