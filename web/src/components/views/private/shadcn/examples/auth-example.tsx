"use client"

//1.- Build authentication cards for sign-in and sign-up flows.
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function AuthExample() {
  //2.- Arrange the forms side by side to mirror the shadcn authentication example.
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your existing Yamato account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input id="signin-email" type="email" placeholder="you@acme.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input id="signin-password" type="password" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <Checkbox id="remember" />
              <span>Remember me</span>
            </label>
            <button className="text-sm text-primary underline-offset-4 hover:underline">Forgot password?</button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full">Sign in</Button>
          <Button variant="outline" className="w-full">
            Continue with GitHub
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Spin up a new tenant with a single click.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Full name</Label>
            <Input id="signup-name" placeholder="Olivia Martin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Work email</Label>
            <Input id="signup-email" type="email" placeholder="ceo@acme.co" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" placeholder="Minimum 8 characters" />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <Checkbox id="terms" />
            <span>
              I agree to the{' '}
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                privacy policy
              </a>
              .
            </span>
          </label>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create account</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
