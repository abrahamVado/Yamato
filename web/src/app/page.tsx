import React from 'react'
import PublicNavbar from '@/components/public/PublicNavbar'
import PublicFooter from '@/components/public/PublicFooter'
import Wave from '@/components/public/Wave' // kept per your earlier request (not used here)
import Icon from '@/components/ui/Icons'   // kept per your earlier request (not used here)

/**
 * Hero section with a wavy bottom edge.  Each hero spans the full
 * height of the viewport and participates in scroll snap.  The
 * `layers` prop controls the number of waves, their vertical
 * offsets and opacity.  The last layer is opaque so that the
 * divider blends cleanly into the next section.
 */
function HeroCurvy({
  title,
  subtitle,
  cta,
  bg,
  nextBg,
  waveH = 220,
  // you can pass 3–6 layers; each item controls a stacked wave path
  // offset: vertical shift (px), amp: how wiggly the curve is (0..1), opacity: 0..1
  layers = [
    { offset: 0, amp: 0.90, opacity: 0.50 },
    { offset: 18, amp: 0.75, opacity: 0.38 },
    { offset: 36, amp: 0.60, opacity: 0.28 },
    { offset: 54, amp: 0.45, opacity: 1.00 }, // last one is the solid edge
  ],
}: {
  title: string
  subtitle?: string
  cta?: React.ReactNode
  /** CSS background for the hero (solid or gradient string) */
  bg: string
  /** Color of the section *below* this hero (wave fill) */
  nextBg: string
  waveH?: number
  layers?: { offset: number; amp: number; opacity: number; color?: string }[]
  /** You can override colours per layer via the 'color' field on each layer */
}) {
  // The fill colour for the waves defaults to the bottom colour of
  // the current gradient (passed via nextBg).  Individual layers can
  // override this via a 'color' property.
  const fillColor = nextBg;

  // A single bezier-based wave path, scaled by "amp"
  const waveD = (amp = 1) => `
    M0,${220 * amp}
    C140,${250 * amp} 260,${120 * amp} 410,${150 * amp}
    C560,${180 * amp} 660,${300 * amp} 820,${250 * amp}
    C1020,${190 * amp} 1140,${120 * amp} 1280,${160 * amp}
    C1360,${182 * amp} 1400,${210 * amp} 1440,${220 * amp}
    L1440,300 L0,300 Z
  `

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden text-white snap-start"
      style={{ background: bg, scrollSnapStop: 'always'}}
      aria-label={title}
    >
      {/* content (boxed).  Apply bottom padding equal to wave height so
          that the content does not overlap the absolute-positioned
          waves. */}
      <div
        className="max-w-[1280px] mx-auto px-6 py-24 md:py-32"
        style={{ paddingBottom: waveH }}
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
          {subtitle && (
            <p className="mt-4 text-white/90 text-lg md:text-xl">{subtitle}</p>
          )}
          {cta && <div className="mt-8">{cta}</div>}
        </div>
      </div>

      {/* soft dotted texture, optional */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden>
          <defs>
            <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#fff" />
            </pattern>
          </defs>
          <rect width="1440" height="600" fill="url(#dots)" />
        </svg>
      </div>

      {/* multi-layer wavy bottom edge.  Each wave uses fillColor
          (either the current section's background or the next
          section's colour).  When a layer specifies its own colour,
          that overrides fillColor. */}
      <svg
        className="absolute bottom-0 left-0 block w-full h-full"
        viewBox="0 0 1440 300"
        height={waveH}
        preserveAspectRatio="none"
        aria-hidden
      >
        {layers.map((l, i) => (
          <g key={i} transform={`translate(0, ${l.offset})`}>
            <path
              d={waveD(l.amp)}
              fill={l.color || fillColor}
              fillOpacity={l.opacity}
            />
          </g>
        ))}
      </svg>
    </section>
  )
}

/**
 * Home page composed of full-screen HeroCurvy sections.  The wrapper
 * uses CSS scroll-snap so that each section snaps into place when
 * scrolling with the mouse or touch.  Header and footer remain
 * outside the scrollable region.
 */
export default function HomePage() {
  return (
    <div className="bg-black text-white w-full overflow-x-hidden flex flex-col h-screen">
      <PublicNavbar />
      {/* Scrollable wrapper: snap-y ensures snapping along the y axis; snap-mandatory forces each child to align exactly when scrolling; scroll-smooth adds smooth animation */}
      <div className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        {/* NIGHT → next (DUSK top color) */}
        <HeroCurvy
          title="🌙 Night — Brand Building & Identity"
          subtitle="Branded content that performs."
          cta={
            <a
              href="#contact"
              className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600 transition"
            >
              Get Started
            </a>
          }
          bg="linear-gradient(to bottom, #022660 0%, #0D469D 100%)"
          nextBg="#0D469D"
          waveH={240}
          // Example with exactly 4 layers
          layers={[
            { offset: 0, amp: 0.95, opacity: 0.45 },
            { offset: 18, amp: 0.80, opacity: 0.35 },
            { offset: 36, amp: 0.60, opacity: 0.25 },
            { offset: 58, amp: 0.48, opacity: 1.00 },
          ]}
        />

        {/* DUSK → next (EVENING top color) */}
        <HeroCurvy
          title="🌆 Dusk — Strategy & Positioning"
          subtitle="From twilight blue to soft purple hues."
          cta={
            <a
              href="#services"
              className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600 transition"
            >
              Explore Services
            </a>
          }
          bg="linear-gradient(to bottom, #0D469D 0%, #6D54A9 100%)"
          nextBg="#6D54A9"
          waveH={240}
          layers={[
            { offset: 0, amp: 0.92, opacity: 0.48 },
            { offset: 16, amp: 0.78, opacity: 0.34 },
            { offset: 34, amp: 0.62, opacity: 0.24 },
            { offset: 56, amp: 0.50, opacity: 1.00 },
          ]}
        />

        {/* EVENING → next (DAWN top color) */}
        <HeroCurvy
          title="🌇 Evening — Creative & Production"
          subtitle="Transitioning to warm magenta and pink."
          cta={
            <a
              href="#work"
              className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600 transition"
            >
              See Our Work
            </a>
          }
          bg="linear-gradient(to bottom, #6D54A9 0%, #CE75C2 100%)"
          nextBg="#CE75C2"
          waveH={240}
          layers={[
            { offset: 0, amp: 0.94, opacity: 0.46 },
            { offset: 18, amp: 0.80, opacity: 0.33 },
            { offset: 36, amp: 0.64, opacity: 0.22 },
            { offset: 60, amp: 0.50, opacity: 1.00 },
          ]}
        />

        {/* DAWN → page background (black) */}
        <HeroCurvy
          title="🌅 Dawn — Launch & Growth"
          subtitle="Warm morning light from pink to peach and orange."
          cta={
            <a
              href="#contact"
              className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600 transition"
            >
              Contact Us
            </a>
          }
          bg="linear-gradient(to bottom, #CE75C2 0%, #E5C7BB 60%, #DB907D 100%)"
          nextBg="#000000" // blends into the page bg (black) before footer
          waveH={260}
          layers={[
            { offset: 0, amp: 0.96, opacity: 0.40 },
            { offset: 22, amp: 0.80, opacity: 0.30 },
            { offset: 44, amp: 0.62, opacity: 0.20 },
            { offset: 72, amp: 0.48, opacity: 1.00 },
          ]}
        />
      </div>
      {/* Footer outside the scrollable region */}
      <PublicFooter />
    </div>
  )
}