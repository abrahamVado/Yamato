"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.location.href = "/verify-email?email=" + encodeURIComponent(email)
  }

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold">Register</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <Button className="w-full" type="submit">Create account</Button>
      </form>
      <div className="mt-4 text-sm text-muted-foreground"><Link href="/login">Already have an account?</Link></div>
    </div>
  )
}
