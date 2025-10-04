import Shell from "@/components/secure/shell"
import { ProfileShowcase } from "@/components/views/private/ProfileShowcase"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <ProfileShowcase />
      </div>
    </Shell>
  )
}
