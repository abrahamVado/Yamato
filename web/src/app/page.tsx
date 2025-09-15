import React from 'react'
import SectionWithEntryExitWaves from '@/components/public/SectionWithEntryExitWaves'
import Button3D from '@/components/ui/Button3D'
import { ArrowRightIcon } from '@phosphor-icons/react'
import './HeroSplit.css' // add the CSS below

export default function Landing() {
  return (
    <div style={{ height: '100dvh', overflowY: 'auto', scrollSnapType: 'y mandatory', background: '#000' }}>
      {/* SECTION 1 — Split hero: Cobalt → Electric Violet */}
      <SectionWithEntryExitWaves
        background="linear-gradient(180deg, #0E3A8A 0%, #7C3AED 100%)"
        baseColor="#0E3A8A"
        showTopBlend={false}                         // first section
        nextColor="#3730A3"                          // blend into indigo
        intensity="aggressive"
        overlay={{ fill: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.00) 50%)' }}
      >

      </SectionWithEntryExitWaves>

      {/* SECTION 2 — Indigo → Coral (pillars) */}
      <SectionWithEntryExitWaves
        background="linear-gradient(180deg, #3730A3 0%, #FB7185 100%)"
        baseColor="#3730A3"
        prevColor="#0E3A8A"                          // top blend from cobalt
        nextColor="#0B1220"                          // deep footer/neutral
        intensity="medium"
        overlay={{ fill: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.00) 60%)' }}
      >
        <section id="home" className="hero-split snap-section" aria-label="Hero">
          <div className="hero-split__grid">
            {/* LEFT PANEL */}
            <div className="hero-split__left">

            </div>

            {/* RIGHT COLUMN → 2 CALL-OUT TILES */}
            <div className="hero-split__right">
              <a className="hero-tile hero-tile--1" href="/learn"></a>
              <a className="hero-tile hero-tile--2" href="/register"></a>
            </div>
            <div className="hero-split__right">
              <a className="hero-tile hero-tile--1" href="/learn"></a>
              <a className="hero-tile hero-tile--2" href="/register"></a>
            </div>  
            <div className="hero-split__left">

            </div>                      

            {/* OPTIONAL ILLUSTRATION OVERLAP (swap path or remove) */}
            <img className="hero-split__illu" src="/assets/illustrations/umbrella.png" alt="" aria-hidden="true" />
          </div>
        </section>
      </SectionWithEntryExitWaves>
    </div>
  )
}
