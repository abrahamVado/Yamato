import Shell from "@/components/secure/shell"
import { ProfileShowcase } from "@/components/views/private/ProfileShowcase"
import { PrivateViewLayout } from "@/components/views/private/PrivateViewLayout"

export default function Page() {
  //1.- Combine the loader shell with the shared header so the profile view mirrors the dashboard chrome.
  return (
    <Shell>
      {/*2.- Inject the profile widgets beneath the navbar using the reusable private view layout.*/}
      <PrivateViewLayout title="Profile">
        {/*3.- Keep showcase spacing consistent across screens by relying on the internal grid.*/}
        <ProfileShowcase />
      </PrivateViewLayout>
    </Shell>
  )
}
