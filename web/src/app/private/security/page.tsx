import Shell from "@/components/secure/shell"
import { SecurityInsights } from "@/components/views/private/SecurityInsights"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <SecurityInsights />
      </div>
    </Shell>
  )
}
