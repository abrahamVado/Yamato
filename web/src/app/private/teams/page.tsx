import Shell from "@/components/secure/shell"
import { TeamsOverview } from "@/components/views/private/TeamsOverview"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <TeamsOverview />
      </div>
    </Shell>
  )
}
