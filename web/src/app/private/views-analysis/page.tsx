import Shell from "@/components/secure/shell"
import { ViewsAnalysisMatrix } from "@/components/views/private/ViewsAnalysisMatrix"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Continue using the secure shell while adding the dashboard-style header to the views analysis workspace.
  return (
    <Shell>
      {/*2.- Provide the analytic title so the navbar keeps visitors oriented within private reporting routes.*/}
      <PrivateViewLayout title="Views analysis">
        {/*3.- Render the matrix inside the shared grid wrapper for consistent spacing.*/}
        <ViewsAnalysisMatrix />
      </PrivateViewLayout>
    </Shell>
  )
}
