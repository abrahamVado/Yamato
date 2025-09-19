"use client";
import * as React from "react";
import CatLoader from "./CatLoader";

type LoaderGuardProps = {
  children: React.ReactNode;
  minDurationMs?: number; // minimum time the overlay is visible
  label?: string;
};

export default function LoaderGuard({
  children,
  minDurationMs = 1000,
  label = "Loading…",
}: LoaderGuardProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    const started = performance.now();

    const fontsReady =
      // @ts-expect-error: fonts may not exist on some browsers
      (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();

    // Collect images inside our scope
    const imgs = Array.from(rootRef.current?.querySelectorAll("img") ?? []);
    const imgPromises = imgs.map(img => {
      if ((img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0) {
        return Promise.resolve();
      }
      return new Promise<void>(resolve => {
        const onDone = () => {
          img.removeEventListener("load", onDone);
          img.removeEventListener("error", onDone);
          resolve();
        };
        img.addEventListener("load", onDone, { once: true });
        img.addEventListener("error", onDone, { once: true });
      });
    });

    (async () => {
      await Promise.all([fontsReady, ...imgPromises]);
      const elapsed = performance.now() - started;
      const wait = Math.max(minDurationMs - elapsed, 0);
      await new Promise(r => setTimeout(r, wait));
      if (alive) setShow(false);
    })();

    return () => {
      alive = false;
    };
  }, [minDurationMs]);

  return (
    <div ref={rootRef} className="relative">
      {/* Content underneath */}
      {children}

      {/* Full-screen overlay */}
      <div
        className={`fixed inset-0 z-50 grid place-items-center transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl bg-background/80 p-6 shadow-lg backdrop-blur">
          <CatLoader label={label} />
        </div>
      </div>
    </div>
  );
}
