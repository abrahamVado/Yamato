// src/components/CatLoader.tsx
"use client";
import * as React from "react";
import styles from "./CatLoader.module.css";
//1.- Import the stylesheet once so Next.js scopes the animation without manual DOM injections.

//2.- Preserve the spinner union so existing surfaces depending on SpinnerType continue compiling without changes.
type SpinnerKind = "fan" | "refresh" | "cog" | "aperture" | "orbit" | "loader" | "ring" | "icon";
export type SpinnerType = SpinnerKind;

//3.- Keep legacy props for compatibility while introducing CSS-module driven styling.
type Props = {
  label?: string;
  size?: number;        // cat canvas size (px)
  spinSize?: number;    // legacy prop, kept for compatibility
  mirror?: boolean;     // flip the entire cat horizontally
  spinner?: SpinnerKind; // legacy prop, the new loader ignores icon choice
  waitForPaw?: boolean; // legacy prop, retained to avoid breaking callers
};

export default function CatLoader({
  label = "Loading…",
  size = 120,
  spinSize: _spinSize = 64,
  mirror = true,
  spinner: _spinner = "fan",
  waitForPaw: _waitForPaw = true,
}: Props) {
  void _spinSize;
  void _spinner;
  void _waitForPaw;
  //4.- Silence legacy props while keeping the public API untouched for existing callers.

  const isServer = typeof window === "undefined";
  //5.- Detect server rendering so we can expose polite live announcements before hydration completes.

  const statusProps = React.useMemo(() => {
    //6.- Advertise aria-live only when rendering on the server to avoid duplicate announcements after hydration.
    return isServer
      ? ({ role: "status", "aria-busy": "true", "aria-live": "polite" } as const)
      : ({ role: "status", "aria-busy": "true" } as const);
  }, [isServer]);

  const frameClassName = mirror ? `${styles.frame} ${styles.mirrored}` : styles.frame;
  //7.- Compose the frame class so mirroring toggles without relying on conditional DOM manipulation.

  return (
    <div className="grid place-items-center text-foreground" {...statusProps}>
      <div
        className={styles.shell}
        style={{ "--cat-loader-size": `${size}px` } as React.CSSProperties}
      >
        <div className={frameClassName}>
          <div className={`${styles.body} ${styles.part}`} data-cat-loader-part="body" />
          <div className={`${styles.body} ${styles.part}`} data-cat-loader-part="body" />
          <div className={`${styles.tail} ${styles.part}`} data-cat-loader-part="tail" />
          <div className={`${styles.head} ${styles.part}`} data-cat-loader-part="head" />
        </div>
      </div>

      {label ? (
        <p className="mt-3 text-sm text-muted-foreground text-center">{label}</p>
      ) : null}
    </div>
  );
}
