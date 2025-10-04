import Shell from "@/components/secure/shell"
import { RolesMatrix } from "@/components/views/private/RolesMatrix"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <RolesMatrix />
      </div>
    </Shell>
  )
}
