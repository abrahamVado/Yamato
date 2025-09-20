"use client";
import * as React from "react";
import { X } from "lucide-react";

export function AnnouncementBar({
  id = "global",
  message,
  className = "",
}: {
  id?: string; // unique key per announcement
  message: string;
  className?: string;
}) {
  const storageKey = `yamato.announcement.hidden:${id}`;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(localStorage.getItem(storageKey) !== "1");
  }, [storageKey]);

  if (!open) return null;
  return (
    <div
      className={
        "w-full bg-primary/10 text-primary px-4 py-2 text-sm flex items-center justify-between " +
        className
      }
      role="status"
      aria-live="polite"
    >
      <span className="truncate">{message}</span>
      <button
        onClick={() => {
          localStorage.setItem(storageKey, "1");
          setOpen(false);
        }}
        className="opacity-70 hover:opacity-100"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
