"use client";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { DashboardOverview } from "@/components/views/private/DashboardOverview";

export default function DashboardPage() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;
  return (
    <DashboardOverview
      isHoverOpen={settings.isHoverOpen}
      isSidebarDisabled={settings.disabled}
      onToggleHover={(value) => setSettings({ isHoverOpen: value })}
      onToggleSidebar={(value) => setSettings({ disabled: value })}
    />
  );
}
