import Shell from "@/components/secure/shell"
import { MapExplorerView } from "@/components/views/private/MapExplorerView"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <MapExplorerView />
      </div>
    </Shell>
  )
}
