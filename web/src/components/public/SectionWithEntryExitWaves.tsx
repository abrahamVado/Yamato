// SectionWithEntryExitWaves.tsx
import React from 'react'

/** Extra decorative wave layer */
export type WaveLayer = {
  d: string
  translateY?: number
  opacity?: number
  solidFill?: string
}

export type WaveIntensity = 'soft' | 'medium' | 'aggressive'

export type SectionProps = {
  /** Section background (usually a gradient) */
  background: string
  /** Dominant color of THIS section (should match top of its background) */
  baseColor: string

  /** Color of the PREVIOUS section (for the top/entry wave blend) */
  prevColor?: string
  /** Color of the NEXT section (for the bottom/exit wave blend) */
  nextColor?: string

  /** Show the top wave (faces downward) that blends prevColor → baseColor */
  showTopBlend?: boolean
  /** Show the bottom wave that blends baseColor → nextColor */
  showBottomBlend?: boolean

  /** Boxed content max width */
  maxWidth?: number
  /** Section height */
  height?: string | number
  /** Wave viewport height in px (both top and bottom) */
  waveHeight?: number

  /** Optional extra decorative layers for top/bottom waves */
  topLayers?: WaveLayer[]
  bottomLayers?: WaveLayer[]

  /** Controls curvature variety */
  intensity?: WaveIntensity

  /** Optional contrast overlay placed between the bg and content */
  overlay?: {
    /** e.g., 'rgba(0,0,0,0.35)' or 'linear-gradient(...)' */
    fill: string
  }

  /** Content */
  children?: React.ReactNode
  /** Enable scroll-snap when stacking sections */
  snap?: boolean
  className?: string
  style?: React.CSSProperties
}

/* ---------- Wave path presets (1440 × 300 viewBox) ---------- */
function getPresetLayers(intensity: WaveIntensity): WaveLayer[] {
  if (intensity === 'aggressive') {
    return [
      {
        d: 'M0,210 C240,60 480,330 720,120 C960,-40 1200,320 1440,160 L1440,300 L0,300 Z',
        opacity: 1,
      },
      {
        d: 'M0,200 C280,340 560,20 900,230 C1120,310 1280,80 1440,220 L1440,300 L0,300 Z',
        translateY: 10,
        opacity: 0.35,
        solidFill: 'rgba(255,255,255,0.35)',
      },
      {
        d: 'M0,220 C220,10 560,340 880,110 C1120,-10 1320,260 1440,190 L1440,300 L0,300 Z',
        translateY: 18,
        opacity: 0.22,
        solidFill: 'rgba(0,0,0,0.20)',
      },
    ]
  }
  if (intensity === 'medium') {
    return [
      {
        d: 'M0,190 C240,240 480,80 720,160 C960,240 1200,120 1440,180 L1440,300 L0,300 Z',
        opacity: 1,
      },
      {
        d: 'M0,180 C260,60 520,300 780,120 C1040,-10 1200,280 1440,150 L1440,300 L0,300 Z',
        translateY: 10,
        opacity: 0.35,
        solidFill: 'rgba(255,255,255,0.35)',
      },
      {
        d: 'M0,200 C220,320 560,10 900,210 C1120,300 1280,120 1440,200 L1440,300 L0,300 Z',
        translateY: 18,
        opacity: 0.22,
        solidFill: 'rgba(0,0,0,0.20)',
      },
    ]
  }
  // soft (default)
  return [
    {
      d: 'M0,180 C220,220 520,120 720,170 C980,240 1200,140 1440,190 L1440,300 L0,300 Z',
      opacity: 1,
    },
    {
      d: 'M0,175 C260,120 520,240 820,150 C1090,80 1250,210 1440,160 L1440,300 L0,300 Z',
      translateY: 10,
      opacity: 0.32,
      solidFill: 'rgba(255,255,255,0.32)',
    },
    {
      d: 'M0,195 C220,280 560,80 900,200 C1120,260 1320,130 1440,210 L1440,300 L0,300 Z',
      translateY: 16,
      opacity: 0.20,
      solidFill: 'rgba(0,0,0,0.18)',
    },
  ]
}

const SVG_VIEWBOX = '0 0 1440 300'

const Waves: React.FC<{
  direction: 'top' | 'bottom'
  height: number
  baseColor: string
  blendFrom?: string // prevColor (when top) or baseColor (when bottom)
  blendTo?: string   // baseColor (top) or nextColor (bottom)
  layers: WaveLayer[]
  reducedMotion?: boolean
}> = ({ direction, height, baseColor, blendFrom, blendTo, layers, reducedMotion }) => {
  const gid = React.useId()
  const gradId = `${direction}-blend-${gid}`

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: direction === 'top'
      ? 'translateX(-50%) scaleY(-1)'
      : 'translateX(-50%)',
    [direction]: 0,
    width: '100vw',
    height,
    pointerEvents: 'none',
    zIndex: 5,
  } as React.CSSProperties

  return (
    <div style={containerStyle} aria-hidden>
      <svg
        viewBox={SVG_VIEWBOX}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {blendFrom && blendTo && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={blendFrom} />
              <stop offset="100%" stopColor={blendTo} />
            </linearGradient>
          )}
        </defs>

        {/* Group is flipped for top (already handled by container transform) */}
        <g>
          {layers.map((layer, i) => {
            const fill = i === 0 && blendFrom && blendTo
              ? `url(#${gradId})`
              : (layer.solidFill ?? baseColor)
            const style: React.CSSProperties = {
              fill,
              opacity: layer.opacity ?? 1,
              stroke: 'none',
              transition: reducedMotion ? undefined : 'transform 400ms ease',
            }
            return (
              <path
                key={i}
                d={layer.d}
                transform={`translate(0, ${layer.translateY ?? 0})`}
                style={style}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

/**
 * Boxed section with FULL-WIDTH waves:
 * - Top "entry" wave (flipped vertically, faces downward) blends prevColor → baseColor
 * - Bottom "exit" wave blends baseColor → nextColor
 * - Optional overlay to ensure text contrast over busy gradients
 */
const SectionWithEntryExitWaves: React.FC<SectionProps> = ({
  background,
  baseColor,
  prevColor,
  nextColor,
  showTopBlend = true,
  showBottomBlend = true,
  maxWidth = 1200,
  height = '100dvh',
  waveHeight = 220,
  intensity = 'medium',
  topLayers,
  bottomLayers,
  overlay,
  children,
  snap = true,
  className,
  style,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const defaultLayers = React.useMemo(() => getPresetLayers(intensity), [intensity])
  const tl = topLayers ?? defaultLayers
  const bl = bottomLayers ?? defaultLayers

  return (
    <section
      className={[snap ? 'snap-start' : '', className].filter(Boolean).join(' ')}
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        background,
        ...style,
      }}
      aria-label="Section with entry/exit blending waves"
    >
      {/* Optional contrast overlay under content */}
      {overlay?.fill && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: overlay.fill,
            zIndex: 1,
          }}
        />
      )}

      {/* Top entry waves */}
      {showTopBlend && prevColor && (
        <Waves
          direction="top"
          height={waveHeight}
          baseColor={baseColor}
          blendFrom={prevColor}
          blendTo={baseColor}
          layers={tl}
          reducedMotion={prefersReducedMotion}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10, // above overlay and waves
          height: '100%',
          width: '100%',
          maxWidth,
          margin: '0 auto',
          padding: 'min(6vw,48px)',
          boxSizing: 'border-box',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        {children}
      </div>

      {/* Bottom exit waves */}
      {showBottomBlend && nextColor && (
        <Waves
          direction="bottom"
          height={waveHeight}
          baseColor={baseColor}
          blendFrom={baseColor}
          blendTo={nextColor}
          layers={bl}
          reducedMotion={prefersReducedMotion}
        />
      )}
    </section>
  )
}

/* ---------- hook: prefers-reduced-motion ---------- */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(!!mq.matches)
    onChange()
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}

export default SectionWithEntryExitWaves
