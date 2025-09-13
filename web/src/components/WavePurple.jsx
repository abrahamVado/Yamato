// WavePurple.jsx
import React from "react";

/**
 * Aggressive multi-layer purple wave.
 * - variant: "aggro" | "soft"
 * - drift: animate each layer horizontally for parallax
 * - speeds: per-layer animation durations (seconds)
 */
export default function WavePurple({
  height = 220,
  flip = false,
  variant = "aggro",
  drift = true,
  // soft lilac → mid → brand purple
  colors = ["#EDE9FE", "#C4B5FD", "var(--brand, #4F46E5)"],
  speeds = [26, 18, 12],
  className = "wave wave--section wave-aggro",
}) {
  const PATHS_SOFT = [
    "M0,120 C160,140 320,150 480,140 C680,126 900,100 1120,120 C1260,132 1350,140 1440,138 L1440,220 L0,220 Z",
    "M0,100 C200,110 340,130 520,125 C760,118 940,108 1180,120 C1320,128 1390,126 1440,124 L1440,220 L0,220 Z",
    "M0,84 C220,92 440,110 720,112 C1000,114 1240,130 1440,128 L1440,220 L0,220 Z",
  ];

  // higher amplitude + sharper undulation
  const PATHS_AGGRO = [
    "M0,160 C140,190 260,20 420,80 C560,132 680,230 820,150 C960,80 1100,220 1240,140 C1340,88 1400,160 1440,140 L1440,220 L0,220 Z",
    "M0,150 C160,170 300,60 460,110 C600,160 760,210 900,150 C1040,90 1180,200 1320,130 C1380,100 1420,140 1440,130 L1440,220 L0,220 Z",
    "M0,140 C120,150 260,120 380,150 C520,190 700,120 860,160 C1040,210 1200,120 1360,170 C1400,184 1420,176 1440,170 L1440,220 L0,220 Z",
  ];

  const layers = variant === "aggro" ? PATHS_AGGRO : PATHS_SOFT;

  return (
    <div
      className={className}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        transform: flip ? "scaleY(-1)" : undefined,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
        {layers.map((d, i) => (
          <g
            key={i}
            className="layer"
            style={drift ? { animationDuration: `${speeds[i % speeds.length]}s` } : undefined}
          >
            <path d={d} fill={colors[i] || colors[colors.length - 1]} />
          </g>
        ))}
      </svg>
    </div>
  );
}
