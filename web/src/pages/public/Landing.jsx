// web/src/AppPublic.jsx — Single‑page landing (no Router)
// Drop‑in: import this in main.jsx and render <AppPublic/>. No React Router needed.
// Uses in‑page anchors + smooth scrolling. Keeps nocturne (dark) toggle.

import React, { useEffect, useMemo, useState } from "react";
import YamatoLogo from '../../../assets/images/yamato-logo-blank.png' // <-- your logo

// If you have flags via Zustand, wire them here. For now a safe default:
const useFlags = () => ({
  loginEnabled: true,
  registerEnabled: true,
});

const Logo = () => (
  <div style={{display:"grid", placeItems:"center", width:128, height:48, border:"1px dashed var(--line)", borderRadius:12}}>
    <img src={YamatoLogo} alt="Yamato Logo" style={{maxWidth:"100%", maxHeight:"100%"}} />
  </div>
);

const LogoBig = () => (
  <div style={{display:"grid", placeItems:"center", width:512, height:256, border:"1px dashed var(--line)", borderRadius:12}}>
    <img src={YamatoLogo} alt="Yamato Logo" style={{maxWidth:"100%", maxHeight:"100%"}} />
  </div>
);

export default function AppPublic(){
  const flags = useFlags();
  const [nocturne, setNocturne] = useState(false);

  // Attach nocturne class to the root shell
  useEffect(()=>{
    const root = document.querySelector(".yamato");
    if (!root) return;
    root.classList.toggle("nocturne", nocturne);
  }, [nocturne]);

  // Smooth scroll helper for in‑page nav
  const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="yamato" style={{minHeight:"100dvh", display:"grid", gridTemplateRows:"auto 1fr auto"}}>
      {/* ───────────────── HEADER (no Router) ───────────────── */}
      <header style={{borderBottom:"1px solid var(--line)", position:"sticky", top:0, zIndex:10, backdropFilter:"saturate(140%) blur(6px)", background:"color-mix(in oklab, var(--bg) 84%, transparent)"}}>
        <div className="container" style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px"}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <Logo/>
            {/* In‑page nav to sections below */}
            <nav style={{display:"flex", gap:12}}>
              <button className="btn ghost" onClick={go("section-home")}>Home</button>
              <button className="btn ghost" onClick={go("section-why")}>Why</button>
              <button className="btn ghost" onClick={go("section-pricing")}>Pricing</button>
              <button className="btn ghost" onClick={go("section-faq")}>FAQ</button>
              <button className="btn ghost" onClick={go("section-docs")}>Docs</button>
            </nav>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <button className="btn" onClick={()=>setNocturne(v=>!v)}>{nocturne ? "☾ Nocturne" : "☀︎ Daylight"}</button>
            {flags.loginEnabled && <a className="btn" href="/login">Login</a>}
            {flags.registerEnabled && <a className="btn solid" href="/register">Get started</a>}
          </div>
        </div>
      </header>

      {/* ───────────────── MAIN (single page sections) ───────────────── */}
      <main>
        {/* HERO */}
        <section id="section-home" className="container" style={{padding:"40px 16px", display:"grid", gap:24}}>
          <div style={{display:"grid", gap:12, textAlign:"center"}}>

            <h1 style={{fontSize:"clamp(28px, 4vw, 48px)", lineHeight:1.1, margin:0}}>Welcome to Yamato</h1>
            <p style={{margin:0, color:"var(--muted)"}}>Secure, multi‑tenant SaaS boilerplate with batteries included.</p>
          </div>
          <div style={{display:"grid", placeItems:"center", gap:12}}>
            <LogoBig/>
            <div style={{display:"flex", gap:12, marginTop:8, flexWrap:"wrap", justifyContent:"center"}}>
              {flags.registerEnabled && <a className="btn solid" href="/register">Create tenant</a>}
              {flags.loginEnabled && <a className="btn" href="/login">Login</a>}
            </div>
          </div>
        </section>

        {/* WHY / PILLARS */}
        <section id="section-why" className="container" style={{padding:"24px 16px", display:"grid", gap:16}}>
          <div style={{display:"grid", gap:8}}>
            <h2 style={{margin:0}}>Why Yamato</h2>
            <p style={{margin:0, color:"var(--muted)"}}>Focus on your product — not the scaffolding.</p>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16}}>
            <Card title="Multi‑tenant core" body="Isolated tenants, scoped access, and sane defaults for RBAC."/>
            <Card title="Modern stack" body="Laravel API + React/Vite web, Postgres, Redis, DX‑first."/>
            <Card title="Ops‑ready" body="Auth flows, env handling, CI/CD‑friendly config out of the box."/>
          </div>
        </section>

        {/* CODE SAMPLE */}
        <section className="container" style={{padding:"12px 16px", display:"grid", gap:12}}>
          <h2 style={{margin:0}}>API at a glance</h2>
          <pre className="code" style={{margin:0, overflow:"auto", padding:16, background:"var(--card)", border:"1px solid var(--line)", borderRadius:"var(--radius)"}}>
{`GET    /api/tenants
POST   /api/tenants              { name }
POST   /api/tenants/:id/invite   { email, role }`}
          </pre>
        </section>

        {/* PRICING */}
        <section id="section-pricing" className="container" style={{padding:"24px 16px", display:"grid", gap:16}}>
          <h2 style={{margin:0}}>Pricing</h2>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16}}>
            <Plan name="Starter" price="$0" blurb="Up to 3 members" cta="Choose"/>
            <Plan name="Team" price="$49/mo" blurb="Up to 20 members" cta="Choose" featured/>
            <Plan name="Scale" price="Contact us" blurb="Unlimited members" cta="Talk to sales"/>
          </div>
        </section>

        {/* FAQ */}
        <section id="section-faq" className="container" style={{padding:"24px 16px", display:"grid", gap:8}}>
          <h2 style={{margin:0}}>FAQ</h2>
          <details><summary>Can I self‑host?</summary><p>Yes. API + web are container‑friendly; Postgres/Redis first‑class.</p></details>
          <details><summary>Custom domains?</summary><p>Yes. Map per‑tenant domain and set tenant context at edge or middleware.</p></details>
          <details><summary>Roles & permissions?</summary><p>Server‑side RBAC + per‑route guards. Client reads capability flags.</p></details>
        </section>

        {/* DOCS CTA */}
        <section id="section-docs" className="container" style={{padding:"24px 16px", display:"grid", placeItems:"center"}}>
          <div style={{display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center"}}>
            <a className="btn ghost" href="/docs">Read the docs</a>
            {flags.registerEnabled && <a className="btn solid" href="/register">Start free</a>}
          </div>
        </section>
      </main>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer style={{borderTop:"1px solid var(--line)", padding:"24px 16px", color:"var(--muted)"}}>
        <div className="container" style={{display:"flex", justifyContent:"space-between", gap:16, flexWrap:"wrap"}}>
          <small>© {new Date().getFullYear()} Yamato — Multi‑tenant SaaS boilerplate</small>
          <div style={{display:"flex", gap:12}}>
            <a className="btn ghost" href="#">Status</a>
            <a className="btn ghost" href="#">Privacy</a>
            <a className="btn ghost" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ title, body }) {
  return (
    <article style={{background:"var(--card)", border:"1px solid var(--line)", borderRadius:"var(--radius)", padding:16}}>
      <h3 style={{marginTop:0}}>{title}</h3>
      <p style={{marginBottom:0, color:"var(--muted)"}}>{body}</p>
    </article>
  );
}

function Plan({ name, price, blurb, cta, featured }){
  return (
    <article aria-label={`${name} plan`} style={{
      background:"var(--card)", border:"1px solid var(--line)", borderRadius:"var(--radius)", padding:16,
      outline: featured ? "2px solid var(--brand)" : undefined
    }}>
      <h3 style={{marginTop:0}}>{name}</h3>
      <p>{blurb}</p>
      <strong>{price}</strong>
      <button className="btn solid" style={{marginTop:12}}>{cta}</button>
    </article>
  );
}
