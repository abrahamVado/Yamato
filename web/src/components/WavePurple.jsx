// WavePurple.jsx
import React from "react";

// Reusable purple wave divider (JS/JSX version)
export default function WavePurple({
  height = 160,                         // number (px) or string like "12rem"
  flip = false,                         // flip vertically (for top caps)
  colors = ["#EDE9FE", "#C4B5FD", "#4F46E5"], // soft → mid → brand purple
  className = "wave wave--section"
}) {
  const style = {
    height: typeof height === "number" ? `${height}px` : height,
    transform: flip ? "scaleY(-1)" : undefined
  };

  return (
    <div className={className} style={style} aria-hidden>
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        role="img"
        aria-label="Decorative wave"
      >
        {/* back (soft) */}
        <path
          d="M0,96 C120,120 240,152 360,152 C540,152 660,112 840,108 C1020,104 1140,132 1260,140 C1350,146 1400,144 1440,142 L1440,160 L0,160 Z"
          fill={colors[0]}
        />
        {/* middle */}
        <path
          d="M0,84 C120,104 240,120 360,122 C540,126 660,108 840,100 C1020,92 1140,102 1260,110 C1350,116 1400,116 1440,116 L1440,160 L0,160 Z"
          fill={colors[1]}
        />
        {/* front (brand) */}
        <path
          d="M0,64 C100,74 220,92 360,96 C520,100 660,84 820,90 C980,96 1120,122 1260,124 C1350,126 1400,118 1440,112 L1440,160 L0,160 Z"
          fill={colors[2]}
        />
      </svg>
    </div>
  );
}
