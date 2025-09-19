// src/components/PageLoadOverlay.tsx
"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import CatLoader, { SpinnerType } from "./CatLoader";

type WaitItem = "images" | "fonts";

type OverlayConfig = {
  waitFor: WaitItem[];     // ["images","fonts"], ["images"], ["fonts"], []
  minDurationMs: number;   // minimum on-screen time
  label: string;
  spinner: SpinnerType;    // "icon" | "ring"
  mirror: boolean;         // flip paw
  size: number;            // paw height
  spinSize: number;        // spinner size
  disabled?: boolean;
};

type Rule = { test: (path: string) => boolean; props: Partial<OverlayConfig> };

/* Defaults */
const defaults: OverlayConfig = {
  waitFor: ["images", "fonts"],
  minDurationMs: 1000,
  label: "Loading…",
  spinner: "icon",
  mirror: true,
  size: 120,
  spinSize: 32,
  disabled: false,
};

/* Per-route overrides (edit as you like) */
const rules: Rule[] = [
  { test: (p) => p === "/loader-demo", props: { label: "Preparing kittens…", waitFor: ["images","fonts"], spinner: "icon", mirror: true } },
  { test: (p) => p.startsWith("/demo/images-only"), props: { label: "Loading images…", waitFor: ["images"], spinner: "ring", mirror: false } },
  { test: (p) => p.startsWith("/demo/fonts-only"), props: { label: "Loading fonts…", waitFor: ["fonts"], spinner: "icon", mirror: true } },
  { test: (p) => p.startsWith("/demo/min-only"), props: { label: "Just a sec…", waitFor: [], minDurationMs: 1200, spinner: "ring", mirror: false } },
  { test: (p) => p === "/login" || p.startsWith("/public/login"), props: { label: "Welcome…", waitFor: [], minDurationMs: 600, spinner: "icon", mirror: false } },
];

export default function PageLoadOverlay() {
  const pathname = usePathname();

  // IMPORTANT: avoid React.useMemo<OverlayConfig>(...) in TSX
  const cfg = React.useMemo(() => {
    const match = rules.find((r) => r.test(pathname));
    return { ...defaults, ...(match?.props ?? {}) };
  }, [pathname]) as OverlayConfig;

  const [visible, setVisible] = React.useState(true);

  // Re-run on every navigation
  React.useEffect(() => {
    if (cfg.disabled) { setVisible(false); return; }

    let alive = true;
    let timer: number | undefined;
    setVisible(true);

    // Full-page: lock scroll & (optional) hide DOM below overlay
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("overlay-active");

    const started = performance.now();
    const promises: Promise<unknown>[] = [];

    // Fonts
    if (cfg.waitFor.includes("fonts")) {
      const fontsReady = (document as any).fonts?.ready ?? Promise.resolve();
      promises.push(fontsReady);
    }

    // Images
    if (cfg.waitFor.includes("images")) {
      const imgs = Array.from(document.querySelectorAll("img"));
      const imgPromises = imgs.map((img) => {
        const el = img as HTMLImageElement;
        if (el.complete && el.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const done = () => {
            el.removeEventListener("load", done);
            el.removeEventListener("error", done);
            resolve();
          };
          el.addEventListener("load", done, { once: true });
          el.addEventListener("error", done, { once: true });
        });
      });
      promises.push(...imgPromises);
    }

    (async () => {
      await Promise.all(promises);
      const elapsed = performance.now() - started;
      const wait = Math.max(cfg.minDurationMs - elapsed, 0);
      timer = window.setTimeout(() => {
        if (!alive) return;
        setVisible(false);
        document.body.style.overflow = "";
        document.documentElement.classList.remove("overlay-active");
      }, wait);
    })();

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
      document.body.style.overflow = "";
      document.documentElement.classList.remove("overlay-active");
    };
  }, [pathname, cfg.disabled, cfg.waitFor, cfg.minDurationMs]);

  return (
    <div
      id="page-loader-overlay"
      className={`fixed inset-0 z-[9999] grid place-items-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      } bg-background`} /* opaque full-page */
      aria-hidden={!visible}
    >
      <CatLoader
        label={cfg.label}
        spinner={cfg.spinner}
        mirror={cfg.mirror}
        size={cfg.size}
        spinSize={cfg.spinSize}
      />
    </div>
  );
}
