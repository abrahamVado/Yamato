// MosaicWallYamato.tsx
import React from 'react'

type CTA = { href: string; label: string; variant?: 'primary' | 'ghost' }
type WallBand = {
  rows?: number
  cols?: number
  gap?: number
  radius?: number
  /** supply colors or leave empty to use CSS variables */
  colors?: string[]
}

const DEFAULT_COLORS = [
  'var(--tile-1)', '#ff8a65', '#2fd6b2', '#ff655f', '#47e6cf', 'var(--tile-1)',
  'var(--tile-2)', '#05a88e', '#ff8a65', '#13c3a2', 'var(--tile-2)', '#ff655f',
  '#08a98e', '#ff655f', '#47e6cf', '#ff8a65', '#059c80', '#47e6cf',
]

function Band({ rows = 3, cols = 6, gap = 14, radius = 10, colors = DEFAULT_COLORS }: WallBand) {
  const total = rows * cols
  const tiles = Array.from({ length: total }, (_, i) => colors[i % colors.length])
  return (
    <div className="mosaicband-wrap" style={{ padding: gap }}>
      <div
        className="mosaicband-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap,
        }}
      >
        {tiles.map((bg, i) => (
          <div
            key={i}
            className="mosaicband-tile"
            style={{ background: bg, borderRadius: radius }}
          />
        ))}
      </div>
    </div>
  )
}

export default function MosaicWallYamato({
  title = 'Yamato Mosaic Wall',
  subtitle = 'Open, modular, on-prem SaaS stack. Built with security and speed.',
  ctas = [
    { href: '/docs', label: 'Read the Docs', variant: 'primary' },
    { href: 'https://github.com/your/repo', label: 'GitHub', variant: 'ghost' },
  ],
  bands = [
    { rows: 3, cols: 6 },
    { rows: 3, cols: 6 },
    { rows: 3, cols: 6 },
  ] as WallBand[],
}: {
  title?: string
  subtitle?: string
  ctas?: CTA[]
  bands?: WallBand[]
}) {
  return (
    <section className="container container--inset yamato-mosaicwall" aria-label="Mosaic wall">
      {/* Header + CTAs */}
      <header className="mwall-head">
        <div className="mwall-text">
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
        </div>
        <nav className="button-flex-scope mwall-ctas" aria-label="Primary actions">
          {ctas.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className={`button-flex ${c.variant === 'ghost' ? 'variant-ghost' : 'variant-primary'}`}
            >
              <span>{c.label}</span>
            </a>
          ))}
        </nav>
      </header>

      {/* Bands */}
      <div className="mwall-bands">
        {bands.map((b, i) => (
          <Band key={i} {...b} />
        ))}
      </div>
    </section>
  )
}
