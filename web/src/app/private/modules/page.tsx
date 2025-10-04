import Shell from "@/components/secure/shell"
import { ModulesConfigurator } from "@/components/views/private/ModulesConfigurator"

export default function Page() {
  return (
    <Shell>
      <div className="grid gap-6">
        <ModulesConfigurator />
      </div>
    </Shell>
  )
}
