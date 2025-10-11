import Shell from "@/components/secure/shell"
import { ModulesConfigurator } from "@/components/views/private/ModulesConfigurator"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Keep the loader experience intact while layering the dashboard header over the modules configurator.
  return (
    <Shell>
      {/*2.- Reuse the shared layout so the navbar mirrors the dashboard title treatment across private pages.*/}
      <PrivateViewLayout title="Modules">
        {/*3.- Render the configurator inside the grid to preserve consistent spacing between widgets.*/}
        <ModulesConfigurator />
      </PrivateViewLayout>
    </Shell>
  )
}
