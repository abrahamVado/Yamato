import Shell from "@/components/secure/shell"
import { SettingsControlPanel } from "@/components/views/private/SettingsControlPanel"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <SettingsControlPanel />
      </div>
    </Shell>
  )
}
