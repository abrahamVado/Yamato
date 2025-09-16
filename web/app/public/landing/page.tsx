import PublicNavbar from "@/components/public/PublicNavbar"
import PublicFooter from "@/components/public/PublicFooter"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}
