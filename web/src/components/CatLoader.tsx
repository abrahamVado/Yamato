// src/components/CatLoader.tsx
"use client";
import * as React from "react";
import { Fan, RefreshCw, Cog, Aperture, Orbit, Loader2 } from "lucide-react";

type SpinnerKind = "fan" | "refresh" | "cog" | "aperture" | "orbit" | "loader" | "ring";

type Props = {
  label?: string;
  size?: number;       // paw height
  spinSize?: number;   // icon size
  mirror?: boolean;    // flip paw
  spinner?: SpinnerKind;
};

export default function CatLoader({
  label = "Loading…",
  size = 120,
  spinSize = 64,        // 2x bigger by default
  mirror = true,
  spinner = "fan",      // very visible rotation
}: Props) {
  return (
    <div className="grid place-items-center text-foreground" aria-busy>
      <div className="relative">
        {/* Static paw (no transforms on wrapper) */}
        <img
          src="/cat_paw.svg"
          alt="Cat paw"
          height={size}
          style={{ height: size, width: "auto" }}
          className={mirror ? "-scale-x-100" : ""}
        />

        {/* Centered spinner layer (no translate on parent) */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {spinner === "ring" ? (
            <span
              aria-label="Loading"
              className="block rounded-full border-2 border-muted-foreground/30 border-t-current animate-spin"
              style={{ width: spinSize, height: spinSize }}
            />
          ) : (
            <SpinIcon kind={spinner} size={spinSize} />
          )}
        </div>
      </div>

      {label && <p className="mt-3 text-sm text-muted-foreground text-center">{label}</p>}
    </div>
  );
}

function SpinIcon({ kind, size }: { kind: SpinnerKind; size: number }) {
  // Tailwind's animate-spin + center origin; ensure SVG uses its own drawing box
  const common = {
    className: "text-muted-foreground animate-spin origin-center",
    style: { width: size, height: size, transformBox: "fill-box" } as any,
    strokeWidth: 2.5,
  } as const;

  switch (kind) {
    case "fan":
      return <Fan {...common} />;
    case "refresh":
      return <RefreshCw {...common} />;
    case "cog":
      return <Cog {...common} />;
    case "aperture":
      return <Aperture {...common} />;
    case "orbit":
      return <Orbit {...common} />;
    case "loader":
    default:
      return <Loader2 {...common} />;
  }
}
