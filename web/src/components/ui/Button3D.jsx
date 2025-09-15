// Button3D.jsx — markup-only, integrates SpinnerBall + centered icons
import React from "react";
import "@/styles/button3d.scss";
import { SpinnerBallIcon as SpinnerBall } from "@phosphor-icons/react";

export const FLEX_BUTTON_VARIANTS = [
  "green","emerald","teal","cyan","sky","azure","blue","indigo","violet","purple","magenta","pink",
  "crimson","red","orange","amber","yellow","gold","lime","chartreuse","olive","mint","turquoise",
  "navy","royal","brown","chocolate","copper","sand","stone","gray","slate","graphite","black","white"
];

export const FLEX_BUTTON_SIZES = ["sm","md","lg"];

// Fit icons to container if caller didn't pass size
const fitIcon = (node) =>
  React.isValidElement(node)
    ? React.cloneElement(node, { size: node.props?.size ?? "100%" })
    : node;

export default function Button3D({
  label = "Click me",
  variant = "green",
  size = "md",
  href,
  target,
  rel,
  onClick,
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  spinnerEl,              // custom spinner node (overrides SpinnerBall)
  spinnerWeight = "bold", // "thin"|"light"|"regular"|"bold"|"fill"|"duotone"
  spinSpeed,              // e.g. ".6s" sets CSS var --spin-speed
  className = "",
  style,
  ...rest
}) {
  const isBlocked = disabled || loading;      // unified disabled/loading check
  const Tag = href ? "a" : "button";
  const hasLeft  = !!leftIcon;
  const hasRight = !!rightIcon || loading;

  const classes =
    `button-flex btn--${variant} btn--${size}` +
    (hasLeft ? " has-left-icon" : "") +
    (hasRight ? " has-right-icon" : "") +
    (loading ? " is-loading" : "") +
    (disabled ? " is-disabled" : "") +
    (className ? ` ${className}` : "");

  const mergedStyle = {
    ...style,
    ...(spinSpeed ? { ["--spin-speed"]: spinSpeed } : null),
  };

  const commonProps = {
    className: classes,
    style: mergedStyle,
    "aria-disabled": isBlocked || undefined,
    "aria-busy": loading || undefined,
    ...rest,
  };

  const Left  = fitIcon(leftIcon);
  const Right = fitIcon(rightIcon);
  const SpinnerNode = fitIcon(spinnerEl ?? <SpinnerBall weight={spinnerWeight} />);


  const content = (
    <>
      {Left && <i className="button-flex__icon button-flex__icon--left">{Left}</i>}
      <span>{label}</span>
      {loading ? (
        <i className="button-flex__icon button-flex__spinner">{SpinnerNode}</i>
      ) : (
        Right && <i className="button-flex__icon button-flex__icon--right">{Right}</i>
      )}
    </>
  );

  if (Tag === "a") {
    // Fully neutralize anchors while blocked: no href/target/rel, no tab stop
    return (
      <a
        {...commonProps}
        role="button"
        href={isBlocked ? undefined : href}
        target={isBlocked ? undefined : target}
        rel={isBlocked ? undefined : (rel || (target === "_blank" ? "noopener noreferrer" : undefined))}
        tabIndex={isBlocked ? -1 : undefined}
        onClick={(e) => {
          if (isBlocked) { e.preventDefault(); e.stopPropagation(); return; }
          onClick?.(e);
        }}
        onMouseDown={isBlocked ? (e) => e.preventDefault() : undefined} // avoids focus/press feel on anchors
        draggable={false}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={isBlocked ? undefined : onClick}
      {...commonProps}
    >
      {content}
    </button>
  );
}
