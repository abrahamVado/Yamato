import Shell from "@/components/secure/shell"
import { SecurityInsights } from "@/components/views/private/SecurityInsights"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Continue guarding the route with the loader shell while surfacing the dashboard header for security insights.
  return (
    <Shell>
      {/*2.- Pass the Security label into the reusable layout so operators see the same navbar treatment.*/}
      <PrivateViewLayout title="Security">
        {/*3.- Render the insights module inside the grid to maintain predictable spacing.*/}
        <SecurityInsights />
      </PrivateViewLayout>
    </Shell>
  )
}
