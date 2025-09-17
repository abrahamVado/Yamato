import * as React from "react"
import Sidebar from "@/components/secure/sidebar"
import Topbar from "@/components/secure/topbar"
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
