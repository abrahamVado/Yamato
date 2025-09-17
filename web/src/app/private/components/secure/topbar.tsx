import ModeToggle from "@/components/ui/mode-toggle"
import MobileSidebar from "@/components/secure/mobile-sidebar"

export default function Topbar() {
  return (
    <div className="h-14 border-b flex items-center px-2 md:px-4 gap-2">
      <div className="md:hidden"><MobileSidebar /></div>
      <div className="font-semibold hidden md:block">Yamato Console</div>
      <div className="ml-auto flex items-center gap-1"><ModeToggle /></div>
    </div>
  )
}
