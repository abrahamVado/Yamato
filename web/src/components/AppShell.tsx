"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import LoaderGuard, { LoaderGuardProps } from "./LoaderGuard";

// Small helper to test path prefixes/regex in order
type RouteRule = {
  test: (path: string) => boolean;
  props: Partial<LoaderGuardProps>;
};

const rules: RouteRule[] = [
  // Demo: images + fonts (default behavior)
  { test: (p) => p === "/loader-demo", props: { label: "Preparing kittens…", waitFor: ["images","fonts"], spinner: "icon", mirror: true } },

  // Demo: wait only for images
  { test: (p) => p.startsWith("/demo/images-only"), props: { label: "Loading images…", waitFor: ["images"], spinner: "ring", mirror: false } },

  // Demo: wait only for fonts
  { test: (p) => p.startsWith("/demo/fonts-only"), props: { label: "Loading fonts…", waitFor: ["fonts"], spinner: "icon", mirror: true } },

  // Demo: minimum duration only (no waiting)
  { test: (p) => p.startsWith("/demo/min-only"), props: { label: "Just a sec…", waitFor: [], minDurationMs: 1200, spinner: "ring", mirror: false } },

  // Demo: login — quick, min-only so it's snappy but still shows
  { test: (p) => p.startsWith("/public/login") || p === "/login", props: { label: "Welcome…", waitFor: [], minDurationMs: 600, spinner: "icon", mirror: false } },
];

// Defaults applied to every route unless overridden
const defaults: Partial<LoaderGuardProps> = {
  waitFor: ["images", "fonts"],
  minDurationMs: 1000,
  label: "Loading…",
  spinner: "icon",
  mirror: true,
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const merged = React.useMemo(() => {
    const match = rules.find(r => r.test(path));
    return { ...defaults, ...(match?.props ?? {}) } as LoaderGuardProps;
  }, [path]);

  return <LoaderGuard {...merged}>{children}</LoaderGuard>;
}
