import { 
  LayoutDashboard, Users, Settings, FileBarChart, Blocks, UserCircle2, UsersRound 
} from "@/components/icons"

export const navItems = [
  { href: "/(private)/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/(private)/users", label: "Users", Icon: Users },
  { href: "/(private)/settings", label: "Settings", Icon: Settings },
  { href: "/(private)/reports", label: "Reports", Icon: FileBarChart },
  { href: "/(private)/modules", label: "Modules", Icon: Blocks },
  { href: "/(private)/my-profile", label: "My Profile", Icon: UserCircle2 },
  { href: "/(private)/teams", label: "Teams", Icon: UsersRound },
]
