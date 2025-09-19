// src/components/RingSpinner.tsx
"use client";
import * as React from "react";

type Props = {
  size?: number;       // diameter
  thickness?: number;  // ring thickness
  className?: string;  // extra classes (e.g., animate-spin duration-[900ms])
  autoContrast?: boolean; // optional: invert vs any bg using mix-blend
};

export default function RingSpinner({
  size = 64,
  thickness = 8,
  className = "animate-spin",
  autoContrast = false,
}: Props) {
  const base = `relative inline-block ${autoContrast ? "mix-blend-difference text-white" : ""}`;

  return (
    <span className={base} style={{ width: size, height: size }}>
      {/* Track (same color, reduced opacity) */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          boxSizing: "border-box",
          border: `${thickness}px solid currentColor`,
          opacity: 0.35,
        }}
      />
      {/* Tip (bright slice) */}
      <span
        role="status"
        aria-label="Loading"
        className={`absolute inset-0 rounded-full ${className}`}
        style={{
          boxSizing: "border-box",
          borderTop: `${thickness}px solid currentColor`,
          borderRight: `${thickness}px solid transparent`,
          borderBottom: `${thickness}px solid transparent`,
          borderLeft: `${thickness}px solid transparent`,
        }}
      />
    </span>
  );
}
