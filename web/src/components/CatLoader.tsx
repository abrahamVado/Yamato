// src/components/CatLoader.tsx
"use client";
import * as React from "react";
import Image from "next/image";
import { Fan, RefreshCw, Cog, Aperture, Orbit, Loader2 } from "lucide-react";
import RingSpinner from "@/components/RingSpinner";

type SpinnerKind = "fan" | "refresh" | "cog" | "aperture" | "orbit" | "loader" | "ring" | "icon";

//1.- Surface the spinner type so LoaderGuard can type its props without re-declaring the union.
export type SpinnerType = SpinnerKind;

type Props = {
  label?: string;
  size?: number;        // paw height (px)
  spinSize?: number;    // spinner size (px)
  mirror?: boolean;     // flip paw horizontally
  spinner?: SpinnerKind;
  waitForPaw?: boolean; // if false, show spinner immediately
};

export default function CatLoader({
  label = "Loading…",
  size = 120,
  spinSize = 64,
  mirror = true,
  spinner = "fan",
  waitForPaw = true,
}: Props) {
  const [pawReady, setPawReady] = React.useState<boolean>(!waitForPaw);

  return (
    <div className="grid place-items-center text-foreground" aria-busy>
      <div className="relative">
        {/* Static paw (ensure /public/cat_paw.svg exists) */}
        <Image
          src="/cat_paw.svg"
          alt="Cat paw"
          width={size}
          height={size}
          priority
          fetchPriority="high"
          onLoadingComplete={() => setPawReady(true)}
          onError={() => setPawReady(true)} // fail-safe
          className={mirror ? "-scale-x-100" : ""}
          style={{ width: size, height: "auto" }}
        />

        {/* Centered spinner — only fades in once the paw is ready */}
        <div
          className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-150 ${
            pawReady ? "opacity-100" : "opacity-0"
          }`}
        >
          {spinner === "ring" ? (
            <RingSpinner size={spinSize} thickness={Math.max(4, Math.floor(spinSize / 8))} />
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
  // Rotate around the icon’s own center; color = currentColor (black on light, white on dark)
  const cls = "text-current animate-spin origin-center";
  const style = { width: size, height: size, transformBox: "fill-box" } as React.CSSProperties;
  const stroke = 2.5;

  switch (kind) {
    case "fan":
      return <Fan className={cls} style={style} strokeWidth={stroke} />;
    case "refresh":
      return <RefreshCw className={cls} style={style} strokeWidth={stroke} />;
    case "cog":
      return <Cog className={cls} style={style} strokeWidth={stroke} />;
    case "aperture":
      return <Aperture className={cls} style={style} strokeWidth={stroke} />;
    case "orbit":
      return <Orbit className={cls} style={style} strokeWidth={stroke} />;
    case "loader":
    case "icon":
    default:
      return <Loader2 className={cls} style={style} strokeWidth={stroke} />;
  }
}
