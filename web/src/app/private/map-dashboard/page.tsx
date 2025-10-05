import Shell from "@/components/secure/shell"
import { MapDashboardView } from "@/components/views/private/MapDashboardView"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <MapDashboardView />
      </div>
    </Shell>
  )
}
