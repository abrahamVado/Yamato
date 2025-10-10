"use client";
import * as React from "react";
import { apiMutation, apiRequest } from "@/lib/api-client";
import type { NotificationItem } from "@/types/notifications";

export function useNotifications() {
  const [items, setItems] = React.useState<NotificationItem[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      //1.- Request the latest notifications from the backend using the shared API client.
      const data = await apiRequest<{ items: NotificationItem[] }>("notifications", { cache: "no-store" });
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
    //1.- Persist the read marker through the centralized mutation helper.
    await apiMutation<unknown>("notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    refresh();
  };

  return { items, loading, error, refresh, unreadCount, markRead };
}
