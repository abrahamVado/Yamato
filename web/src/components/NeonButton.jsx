// NeonButton.jsx
import React from "react";
import '@/styles/buttons-neon.scss'

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function NeonButton({
  as: As = "button",
  color = "purple",          // purple | teal | green | pink
  variant = "rect",          // rect | pill | circle
  size = "md",               // sm | md | lg
  icon = null,               // <svg/> or any node
  children,
  className = "",
  ...rest
}) {
  const isCircle = variant === "circle";
  const baseClass = cx(
    "neon-btn",
    `neon-btn--${color}`,
    `neon-btn--${variant}`,
    `neon-btn--${size}`,
    icon && !isCircle && "has-icon",
    className
  );

  // default type for <button>
  const extra =
    As === "button" ? { type: rest.type ?? "button", ...rest } : rest;

  return (
    <As className={baseClass} {...extra}>
      {icon && <span className="neon-btn__icon" aria-hidden="true">{icon}</span>}
      {!isCircle && <span className="neon-btn__label">{children}</span>}
      {/* decorative layers */}
      <span className="neon-btn__shine" aria-hidden="true" />
      <span className="neon-btn__rim" aria-hidden="true" />
    </As>
  );
}

/* --------- minimalist inline icons (feel free to swap any library) --------- */
export const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...p}>
    <path d="M9.2 17.2 3.9 11.9l1.9-1.9 3.4 3.4L18.3 4.4l1.9 1.9z" />
  </svg>
);

export const IconBell = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...p}>
    <path d="M12 22a2.2 2.2 0 0 0 2.1-2.1h-4.2A2.2 2.2 0 0 0 12 22ZM20 17H4l1.6-1.9c.3-.4.4-.9.4-1.4V10a6 6 0 1 1 12 0v3.7c0 .5.1 1 .4 1.4L20 17z" />
  </svg>
);

export const IconCart = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...p}>
    <path d="M7.3 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm9.4 0a1.5 1.5 0 1 0 .001 3.001 1.5 1.5 0 0 0-.001-3ZM6.1 6h14l-1.6 7.6a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.2 3.5H2V2h4.1L7 5.2l-.9.8Z" />
  </svg>
);

export const IconVR = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...p}>
    <path d="M5 7h14a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-3.5a3 3 0 0 1-2.6-1.6l-.4-.8-.4.8A3 3 0 0 1 9.5 17H6a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Zm10.2 3.5h1.6v3h-1.2l-.8-1.6-.8 1.6h-1.3v-3h1.6l.5 1.1.4-1.1ZM7.5 10.5h3v3h-3v-3Z" />
  </svg>
);
