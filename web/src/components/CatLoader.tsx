// src/components/CatLoader.tsx
"use client";
import * as React from "react";

type SpinnerKind = "fan" | "refresh" | "cog" | "aperture" | "orbit" | "loader" | "ring" | "icon";

//1.- Surface the spinner type so LoaderGuard can type its props without re-declaring the union.
export type SpinnerType = SpinnerKind;

type Props = {
  label?: string;
  size?: number;        // cat canvas size (px)
  spinSize?: number;    // legacy prop, kept for compatibility
  mirror?: boolean;     // flip the entire cat horizontally
  spinner?: SpinnerKind; // legacy prop, the new loader ignores icon choice
  waitForPaw?: boolean; // legacy prop, retained to avoid breaking callers
};

const CAT_LOADER_STYLE_ID = "yamato-cat-loader-styles";

//2.- Provide the cat loader styles as a runtime string so both Next.js and the node:test environment can consume them without a bundler.
const CAT_LOADER_CSS = String.raw`
.cat-loader__frame {
  position: relative;
  width: min(var(--cat-loader-size, 160px), 100%);
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: #e6dcdc;
}

.cat-loader__frame:hover > * {
  animation-play-state: paused;
}

.cat-loader__frame:active > * {
  animation-play-state: running;
}

.cat-loader__part {
  position: absolute;
  inset: 0;
  animation: cat-loader-rotating 2.79s cubic-bezier(.65, .54, .12, .93) infinite;
}

.cat-loader__part::before {
  content: "";
  position: absolute;
  inline-size: 50%;
  block-size: 50%;
  background-size: 200%;
  background-repeat: no-repeat;
  background-image: url('https://images.weserv.nl/?url=i.imgur.com/M1raXX3.png&il');
}

.cat-loader__head::before {
  top: 0;
  right: 0;
  background-position: 100% 0%;
  transform-origin: 0% 100%;
  transform: rotate(90deg);
}

.cat-loader__tail {
  animation-delay: .2s;
}

.cat-loader__tail::before {
  left: 0;
  bottom: 0;
  background-position: 0% 100%;
  transform-origin: 100% 0%;
  transform: rotate(-30deg);
}

.cat-loader__body {
  animation-delay: .1s;
}

.cat-loader__body:nth-of-type(2) {
  animation-delay: .2s;
}

.cat-loader__body::before {
  right: 0;
  bottom: 0;
  background-position: 100% 100%;
  transform-origin: 0% 0%;
}

@keyframes cat-loader-rotating {
  from { transform: rotate(720deg); }
  to { transform: none; }
}

.cat-loader__mirrored {
  transform: scaleX(-1);
}

.cat-loader__shell {
  display: grid;
  place-items: center;
  text-align: center;
  color: inherit;
}
`;

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
  //3.- Silence legacy props while keeping the public API untouched for existing callers.

  //4.- Append the CSS to the document head on the client so repeated mounts reuse a single stylesheet.
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(CAT_LOADER_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = CAT_LOADER_STYLE_ID;
    style.textContent = CAT_LOADER_CSS;
    document.head.appendChild(style);
  }, []);

  const isServer = typeof window === "undefined";
  //5.- Detect server rendering so the initial HTML ships with embedded styles, avoiding an unstyled flash.

  return (
    <div className="grid place-items-center text-foreground" aria-busy>
      {isServer ? (
        <style id={CAT_LOADER_STYLE_ID} dangerouslySetInnerHTML={{ __html: CAT_LOADER_CSS }} />
      ) : null}

      <div
        className={`cat-loader__shell`}
        style={{ "--cat-loader-size": `${size}px` } as React.CSSProperties}
      >
        <div className={`cat-loader__frame ${mirror ? "cat-loader__mirrored" : ""}`}>
          <div className="cat-loader__body cat-loader__part" />
          <div className="cat-loader__body cat-loader__part" />
          <div className="cat-loader__tail cat-loader__part" />
          <div className="cat-loader__head cat-loader__part" />
        </div>
      </div>

      {label && <p className="mt-3 text-sm text-muted-foreground text-center">{label}</p>}
    </div>
  );
}
