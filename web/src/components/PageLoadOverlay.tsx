"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const CatLoader = dynamic(() => import("@/components/CatLoader"), { ssr: false });

function waitForImages(timeoutMs = 10000) {
  const imgs = Array.from(document.images || []);
  const pending = imgs.filter(img => !img.complete || img.naturalWidth === 0);

  const allImgPromises = pending.map(
    img =>
      new Promise<void>(resolve => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      })
  );

  const fontsPromise =
    (document as any).fonts?.ready?.catch?.(() => {}) ?? Promise.resolve();

  const timeout = new Promise<void>(resolve => setTimeout(resolve, timeoutMs));

  return Promise.race([Promise.all([Promise.all(allImgPromises), fontsPromise]).then(() => {}), timeout]);
}

export default function PageLoadOverlay() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(true);   // show on first paint
  const [animOut, setAnimOut] = React.useState(false);

  // First load: wait for window.load (covers static assets, CSS, etc.)
  React.useEffect(() => {
    setMounted(true);
    if (document.readyState === "complete") {
      setVisible(false);
    } else {
      const onLoad = () => setVisible(false);
      window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Route changes: show overlay, then wait for images/fonts in the new view
  React.useEffect(() => {
    if (!mounted) return;
    // show
    setAnimOut(false);
    setVisible(true);

    // next tick: DOM has new route; then wait for resources
    const id = requestAnimationFrame(async () => {
      try {
        await waitForImages(10000); // safety timeout
      } finally {
        // smooth fade out
        setAnimOut(true);
        const t = setTimeout(() => {
          setVisible(false);
          setAnimOut(false);
        }, 220); // match transition duration below
        return () => clearTimeout(t);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, search, mounted]);

  if (!mounted) return null;
  if (!visible && !animOut) return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-0 z-[9999] grid place-items-center bg-background/80 backdrop-blur-sm transition-opacity duration-200 ${
        animOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-[200px]">
        <CatLoader label="Cargando gatito…" />
      </div>
    </div>,
    document.body
  );
}
