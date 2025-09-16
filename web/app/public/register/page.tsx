import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form className="space-y-4">
        <Input type="text" placeholder="Full name" required />
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <Button className="w-full" type="submit">Sign up</Button>
      </form>
    </div>
  )
}
