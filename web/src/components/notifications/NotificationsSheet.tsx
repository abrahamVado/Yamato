"use client";
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
import { useNotifications } from "./use-notifications";
import type { NotificationItem } from "@/types/notifications";

export function NotificationsSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { items, loading, error, markRead } = useNotifications();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-96 p-0">
        <SheetHeader className="p-4">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="border-t" />
        <ScrollArea className="h-[calc(100vh-7rem)] p-3">
          {loading && <div className="p-3 text-sm text-muted-foreground">Loading…</div>}
          {error && <div className="p-3 text-sm text-destructive">{error}</div>}
          {!loading && !error && (
            <div className="space-y-3">
              {(items ?? []).length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">You're all caught up.</div>
              )}
              {(items ?? []).map((n) => (
                <NotificationCard key={n.id} n={n} onMarkRead={() => markRead(n.id)} />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function NotificationCard({ n, onMarkRead }: { n: NotificationItem; onMarkRead: () => void }) {
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <Badge variant={badgeFor(n.kind)} className="shrink-0 capitalize">{n.kind}</Badge>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <p className="font-medium leading-tight truncate">{n.title}</p>
            {!n.readAt && (
              <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" aria-label="unread" />
            )}
          </div>
          {n.body && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{n.body}</p>}
          <p className="text-[11px] text-muted-foreground mt-1">
            {new Date(n.createdAt).toLocaleString()}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {!n.readAt && (
              <Button size="sm" variant="secondary" onClick={onMarkRead}>Mark read</Button>
            )}
            {n.actionUrl && (
              <a className="inline-flex items-center gap-1 text-sm underline" href={n.actionUrl}>
                Open <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function badgeFor(kind: string): "default" | "secondary" | "destructive" | "outline" {
  switch (kind) {
    case "success":
      return "default";
    case "warning":
      return "secondary";
    case "error":
      return "destructive";
    default:
      return "outline";
  }
}
