"use client";
import * as React from "react";
import { Loader2 } from "lucide-react";

type Props = {
  label?: string;
  size?: number;      // paw height (px)
  spinSize?: number;  // spinner size (px)
  mirror?: boolean;   // flip paw horizontally
};

export default function CatLoader({
  label = "Loading…",
  size = 120,
  spinSize = 32,
  mirror = true,
}: Props) {
  return (
    <div className="grid place-items-center p-6 text-foreground" aria-busy>
      <div className="relative flex flex-col items-center">
        <div className="relative">
          {/* Static paw (no rotation, no animation) */}
          <img
            src="/cat_paw.svg"
            alt="Cat paw"
            height={size}
            style={{ height: size, width: "auto" }}
            className={mirror ? "-scale-x-100" : ""}
          />

          {/* Only the icon animates */}
          <Loader2
            aria-label="Loading"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
            style={{ width: spinSize, height: spinSize }}
          />
        </div>

        {label && (
          <p className="mt-3 text-sm text-muted-foreground text-center">{label}</p>
        )}
      </div>
    </div>
  );
}
