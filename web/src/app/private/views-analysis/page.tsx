import Shell from "@/components/secure/shell"
import { ViewsAnalysisMatrix } from "@/components/views/private/ViewsAnalysisMatrix"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <ViewsAnalysisMatrix />
      </div>
    </Shell>
  )
}
