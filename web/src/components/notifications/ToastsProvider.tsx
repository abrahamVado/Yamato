"use client";
import * as React from "react";
import { Toaster } from "sonner";

export function ToastsProvider() {
  return (
    <Toaster
      richColors
      position="top-right"
      closeButton
      toastOptions={{
        classNames: {
          toast: "border shadow-sm",
          title: "font-medium",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}
