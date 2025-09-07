// src/components/ProgressFloat.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

export default function ProgressFloat({
  src = "/progress.png",
  size = 72,
  sections = [],            // optional: section IDs in order
  anchor = "right",         // "right" | "left"
  offset = 16,              // px from edge
  trackHeight = 260,        // vertical travel space
  clickToAdvance = true,
  dirPxThreshold = 2,       // pixels needed to consider a direction change
  rotateMs = 120,           // flip duration
}) {
  const [progress, setProgress] = useState(0);   // 0..1
  const [activeIndex, setActiveIndex] = useState(0);
  const [angle, setAngle] = useState(180);       // start facing DOWN
  const [dragging, setDragging] = useState(false);
  const lastDir = useRef(1);                     // 1 = down, -1 = up
  const prevScrollY = useRef(0);
  const movedSinceDown = useRef(false);

  // --- Scroll listener: update progress and face current direction ---
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const dy = y - prevScrollY.current;

      // direction detection with dead-zone
      let dir = 0;
      if (dy > dirPxThreshold) dir = 1;
      else if (dy < -dirPxThreshold) dir = -1;

      if (dir !== 0 && dir !== lastDir.current) {
        setAngle(dir === 1 ? 180 : 0);          // face down/up
        lastDir.current = dir;
      }

      // progress (0..1)
      const doc = document.documentElement;
      const body = document.body;
      const scrollHeight = doc.scrollHeight || body.scrollHeight;
      const clientHeight = doc.clientHeight;
      const max = Math.max(1, scrollHeight - clientHeight);
      setProgress(clamp(y / max, 0, 1));

      prevScrollY.current = y;
    };

    prevScrollY.current = window.scrollY || 0;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dirPxThreshold]);

  // --- Drag to scroll: map pointer Y to progress along the track ---
  const onPointerDown = (e) => {
    setDragging(true);
    movedSinceDown.current = false;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    movedSinceDown.current = true;

    const trackTop = window.innerHeight * 0.5 - trackHeight * 0.5;
    const p = clamp((e.clientY - trackTop) / trackHeight, 0, 1);

    const doc = document.documentElement;
    const body = document.body;
    const scrollHeight = doc.scrollHeight || body.scrollHeight;
    const clientHeight = doc.clientHeight;
    const max = Math.max(1, scrollHeight - clientHeight);

    window.scrollTo({ top: Math.round(p * max), behavior: "auto" });
  };

  const endDrag = (e) => {
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  // Optional: update active section by viewport center
  useEffect(() => {
    if (!sections.length) return;
    const mid = window.innerHeight / 2;
    let best = 0, bestDist = Infinity;
    sections.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const d = Math.abs(center - mid);
      if (d < bestDist) { bestDist = d; best = idx; }
    });
    setActiveIndex(best);
  }, [progress, sections]);

  const style = useMemo(() => {
    const y = Math.round(progress * trackHeight);
    const side = anchor === "left" ? { left: offset } : { right: offset };
    return {
      position: "fixed",
      zIndex: 1000,
      top: `calc(50% - ${trackHeight / 2}px + ${y}px)`,
      ...side,
      width: size,
      height: size,
      pointerEvents: "auto",
      userSelect: "none",
      cursor: dragging ? "grabbing" : "grab",
      touchAction: "none", // prevent native scroll while dragging
    };
  }, [progress, anchor, offset, size, trackHeight, dragging]);

  const onClick = () => {
    if (!clickToAdvance || !sections.length || movedSinceDown.current) return;
    const next = Math.min(sections.length - 1, activeIndex + 1);
    document.getElementById(sections[next])?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pctLabel = Math.round(progress * 100) + "%";

  return (
    <div
      style={style}
      title={pctLabel}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <img
        src={src}
        alt={`Progress ${pctLabel}`}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          transform: `rotate(${angle}deg)`,
          transformOrigin: "50% 50%",
          transition: `transform ${rotateMs}ms ease-out`,
          willChange: "transform",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,.35))",
          pointerEvents: "none", // let the wrapper handle pointer events
        }}
        draggable={false}
      />
      <div style={{
        position: "absolute",
        right: anchor === "left" ? "auto" : "-8px",
        left:  anchor === "left" ? "-8px" : "auto",
        top: "-10px",
        background: "var(--card)",
        color: "var(--text)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: "2px 6px",
        fontSize: 12,
        fontWeight: 700, // <-- bold percentage
      }}>{pctLabel}</div>
    </div>
  );
}
