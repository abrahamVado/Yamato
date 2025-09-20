"use client";
import * as React from "react";
import type { NotificationItem } from "@/types/notifications";

export function useNotifications() {
  const [items, setItems] = React.useState<NotificationItem[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = (await res.json()) as { items: NotificationItem[] };
      setItems(data.items);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const unreadCount = (items ?? []).filter((n) => !n.readAt).length;

  const markRead = async (id: string) => {
    await fetch(`/api/notifications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    refresh();
  };

  return { items, loading, error, refresh, unreadCount, markRead };
}
