import Shell from "@/components/secure/shell"
import { MapReportsView } from "@/components/views/private/MapReportsView"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <MapReportsView />
      </div>
    </Shell>
  )
}
