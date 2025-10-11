import Shell from "@/components/secure/shell"
import { SettingsControlPanel } from "@/components/views/private/SettingsControlPanel"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Wrap the settings dashboard with the loader shell and shared navbar to align with the main dashboard chrome.
  return (
    <Shell>
      {/*2.- Use the reusable layout so the Settings title displays in the sticky header across private routes.*/}
      <PrivateViewLayout title="Settings">
        {/*3.- Keep the control panel spacing uniform by leveraging the grid container.*/}
        <SettingsControlPanel />
      </PrivateViewLayout>
    </Shell>
  )
}
