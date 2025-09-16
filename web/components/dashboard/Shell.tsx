import Sidebar from "./Sidebar"
import Topbar from "./topbar/Topbar"

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="hidden md:block border-r bg-background">
        <Sidebar />
      </aside>
      <div className="flex min-h-dvh flex-col">
        <Topbar />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
