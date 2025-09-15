import React from 'react'
import SectionWithEntryExitWaves from '@/components/public/SectionWithEntryExitWaves'
import Button3D from '@/components/ui/Button3D'
import { ArrowRightIcon } from '@phosphor-icons/react'
import './HeroSplit.css' // add the CSS below
type KPI = { value: string; label: string }
type CTA = { href: string; label: string; variant?: 'primary' | 'ghost' }

export default function HeroSplitYamato({
  title = 'Yamato Industries',
  lead = 'Open-source SaaS tooling. Secure, fast, and community-driven.',
  kpis = [
    { value: '1.3k+', label: 'GitHub ⭐' },
    { value: '24ms', label: 'P95 API' },
    { value: '100%', label: 'On-prem ready' },
  ],
  ctas = [
    { href: '#get-started', label: 'Get Started', variant: 'primary' },
    { href: '#repo', label: 'GitHub', variant: 'ghost' },
  ],
  illuSrc, // optional illustration
}: {
  title?: string
  lead?: string
  kpis?: KPI[]
  ctas?: CTA[]
  illuSrc?: string
}) {
  // Build 18 tiles alternating brand tokens + subtle shades
  const palette = [
    'var(--tile-1)', '#ff8a65', '#2fd6b2', '#ff655f', '#47e6cf', 'var(--tile-1)',
    'var(--tile-2)', '#05a88e', '#ff8a65', '#13c3a2', 'var(--tile-2)', '#ff655f',
    '#08a98e', '#ff655f', '#47e6cf', '#ff8a65', '#059c80', '#47e6cf',
  ]

  return (
    <section className="container container--inset" aria-label="Yamato hero">
      <div className="hero-split__grid">
        {/* LEFT */}
        <div className="hero-split__left">
          <div className="hero-split__raindrops" />
          <div className="bl-hero__copy">
            <h1>{title}</h1>
            <p className="lead">{lead}</p>

            <div className="bl-cta button-flex-scope" role="group" aria-label="Primary actions">
              {ctas.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className={`button-flex ${c.variant === 'ghost' ? 'variant-ghost' : 'variant-primary'}`}
                >
                  <span>{c.label}</span>
                </a>
              ))}
            </div>

            <div className="bl-kpis" aria-label="Key metrics">
              {kpis.map((k, i) => (
                <div key={i}>
                  <b>{k.value}</b>
                  <small>{k.label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-split__right">
          {/* Mosaic */}
          <div className="mosaic-wrap" aria-hidden="true">
            <div className="mosaic-grid">
              {palette.map((bg, i) => (
                <div className="mosaic-tile" style={{ background: bg }} key={i} />
              ))}
            </div>
          </div>

          {/* Two callouts under mosaic, tied to your tokens */}
          <div className="mosaic-bottom">
            <a className="hero-tile hero-tile--1" href="#docs">Docs</a>
            <a className="hero-tile hero-tile--2" href="#community">Community</a>
          </div>
        </div>

        {illuSrc && <img alt="" className="hero-split__illu" src={illuSrc} />}
      </div>

      {/* Pillars */}
      <div className="section-head" style={{ marginTop: 18 }}>
        <h2>Why Yamato?</h2>
        <p className="muted">Production-grade blocks for secure, high-performance apps.</p>
      </div>

      <ul className="pillars">
        <li className="card glass">
          <div className="pillars__title">Security-first</div>
          <div className="pillars__desc">On-prem, audit trails, role-based policies.</div>
        </li>
        <li className="card glass">
          <div className="pillars__title">DX you’ll love</div>
          <div className="pillars__desc">Great docs, templates, and CLIs.</div>
        </li>
        <li className="card glass">
          <div className="pillars__title">Open & modular</div>
          <div className="pillars__desc">Pick what you need. Extend easily.</div>
        </li>
      </ul>

      <div className="fineprint">MIT licensed • Built with ❤️ by the Yamato community</div>
    </section>
  )
}
