import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ValidateEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader><CardTitle>Check your email</CardTitle></CardHeader>
        <CardContent>We sent you a verification link.</CardContent>
      </Card>
    </div>
  )
}
