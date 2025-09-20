"use client";
import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "./use-notifications";
import { NotificationsSheet } from "./NotificationsSheet";

export function NotificationsBell() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-red-500 px-1 text-[10px] font-medium text-white grid place-items-center">
            {unreadCount}
          </span>
        )}
      </Button>
      <NotificationsSheet open={open} onOpenChange={setOpen} />
    </div>
  );
}
