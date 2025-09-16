import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form className="space-y-4">
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Button className="w-full" type="submit">Sign in</Button>
      </form>
      <div className="text-sm text-muted-foreground mt-4 flex justify-between">
        <Link href="/(public)/recover-password">Forgot password?</Link>
        <Link href="/(public)/register">Create account</Link>
      </div>
    </div>
  )
}
