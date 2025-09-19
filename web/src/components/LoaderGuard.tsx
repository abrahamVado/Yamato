"use client";
import * as React from "react";
import CatLoader, { SpinnerType } from "./CatLoader";

type WaitItem = "images" | "fonts";

export type LoaderGuardProps = {
  children: React.ReactNode;

  // Behavior
  waitFor?: WaitItem[];         // ["images","fonts"], ["images"], ["fonts"], or []
  minDurationMs?: number;       // minimum overlay time
  active?: boolean;             // optional controlled mode; if undefined, auto mode
  onHidden?: () => void;        // callback when overlay fully hides

  // Visuals (passed to CatLoader)
  label?: string;
  mirror?: boolean;
  spinner?: SpinnerType;
  size?: number;
  spinSize?: number;
};

export default function LoaderGuard({
  children,
  waitFor = ["images", "fonts"],
  minDurationMs = 1000,
  active,
  onHidden,
  label = "Loading…",
  mirror = true,
  spinner = "icon",
  size = 120,
  spinSize = 32,
}: LoaderGuardProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(true);

  // Controlled mode: honor `active` with min-duration gating
  React.useEffect(() => {
    if (active === undefined) return; // not in controlled mode

    let t: number | undefined;
    const started = performance.now();
    setShow(true);

    if (!active) {
      const elapsed = performance.now() - started;
      const wait = Math.max(minDurationMs - elapsed, 0);
      t = window.setTimeout(() => setShow(false), wait);
    }

    return () => { if (t) clearTimeout(t); };
  }, [active, minDurationMs]);

  // Auto mode: wait for images/fonts then apply minDurationMs
  React.useEffect(() => {
    if (active !== undefined) return; // controlled mode bypasses auto

    let alive = true;
    const started = performance.now();

    const promises: Promise<unknown>[] = [];

    if (waitFor.includes("fonts")) {
      const fontsReady = (document as any).fonts?.ready ?? Promise.resolve();
      promises.push(fontsReady);
    }

    if (waitFor.includes("images")) {
      const imgs = Array.from(rootRef.current?.querySelectorAll("img") ?? []);
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
      const wait = Math.max(minDurationMs - elapsed, 0);
      await new Promise((r) => setTimeout(r, wait));
      if (alive) setShow(false);
    })();

    return () => { alive = false; };
  }, [waitFor, minDurationMs, active]);

  React.useEffect(() => {
    if (!show && onHidden) onHidden();
  }, [show, onHidden]);

  return (
    <div ref={rootRef} className="relative">
      {children}

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 grid place-items-center transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl bg-background/80 p-6 shadow-lg backdrop-blur">
          <CatLoader
            label={label}
            mirror={mirror}
            spinner={spinner}
            size={size}
            spinSize={spinSize}
          />
        </div>
      </div>
    </div>
  );
}
