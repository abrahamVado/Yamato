
// AppPublicMultiLayout.jsx — multiple landing layout designs (no Router)
// Usage:
//   import AppPublicMultiLayout from './pages/public/AppPublicMultiLayout.jsx'
//   createRoot(...).render(<AppPublicMultiLayout />)
// Switch layout with ?layout=classic|split|banner|sidebar|cards
// Logo uses /public asset path to avoid import resolution issues.

import React, { useEffect, useState } from "react";
import YamatoLogo from "@/images/yamato-logo-blank.png";

const useFlags = () => ({ loginEnabled: true, registerEnabled: true });

const Logo = ({ size = 128 }) => (
  <div style={{display:"grid", placeItems:"center", width:size, height:size/2, border:"1px dashed var(--line)", borderRadius:12}}>
    <img src={YamatoLogo} alt="Yamato Logo" style={{maxWidth:"100%", maxHeight:"100%"}} />
  </div>
);

const CTAGroup = ({ primary = {label:"Get started", href:"/register"}, secondary = {label:"Login", href:"/login"} }) => (
  <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
    <a className="btn solid" href={primary.href}>{primary.label}</a>
    <a className="btn" href={secondary.href}>{secondary.label}</a>
  </div>
);

/* ---------- Layout Variants ---------- */

function LayoutClassic(){
  return (
    <section className="container" style={{padding:"40px 16px", display:"grid", gap:24}}>
      <div style={{display:"grid", gap:8, justifyItems:"center", textAlign:"center"}}>
        <span className="badge">Yamato</span>
        <h1 style={{fontSize:"clamp(28px, 5vw, 54px)", lineHeight:1.1, margin:0}}>Welcome to Yamato</h1>
        <p className="muted" style={{margin:0}}>Secure, multi‑tenant SaaS boilerplate with batteries included.</p>
      </div>
      <div style={{display:"grid", placeItems:"center", gap:16}}>
        <Logo size={512} />
        <CTAGroup />
      </div>
    </section>
  );
}

function LayoutSplit(){
  return (
    <section className="container hero-grid two-col" style={{padding:"40px 16px"}}>
      <div style={{display:"grid", gap:12}}>
        <h1 style={{fontSize:"clamp(28px, 5vw, 54px)", lineHeight:1.1, margin:0}}>Launch faster. Sleep better.</h1>
        <p className="muted" style={{margin:0}}>Multi‑tenant core, modern stack, and ops‑ready patterns.</p>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          <a className="btn solid" href="/register">Create tenant</a>
          <a className="btn ghost" href="/docs">See docs</a>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:12}}>
          <div className="kpi"><b>~80%</b><small>less boilerplate</small></div>
          <div className="kpi"><b>5 min</b><small>to first deploy</small></div>
          <div className="kpi"><b>∞</b><small>tenants</small></div>
        </div>
      </div>
      <div style={{display:"grid", placeItems:"center"}}>
        <Logo size={420} />
      </div>
    </section>
  );
}

function LayoutBanner(){
  return (
    <section className="full-bleed" style={{padding:"64px 0"}}>
      <div className="container" style={{display:"grid", gap:16, justifyItems:"center", textAlign:"center"}}>
        <h1 style={{fontSize:"clamp(30px, 6vw, 64px)", margin:0}}>Build a serious SaaS in days</h1>
        <p className="muted" style={{margin:0, maxWidth:680}}>Tenancy, auth, billing hooks, and a React/Vite front end, wired for CI/CD and containerized backends.</p>
        <CTAGroup primary={{label:"Start free", href:"/register"}} secondary={{label:"View docs", href:"/docs"}} />
        <div style={{marginTop:12}}><Logo size={420} /></div>
      </div>
    </section>
  );
}

function LayoutSidebar(){
  return (
    <section className="container" style={{padding:"40px 16px"}}>
      <div style={{display:"grid", gap:24, gridTemplateColumns:"280px 1fr"}}>
        <aside style={{display:"grid", gap:12}}>
          <h3 style={{margin:"4px 0"}}>Why Yamato</h3>
          <ul style={{margin:0, paddingLeft:18, color:"var(--muted)", display:"grid", gap:6}}>
            <li>Tenant isolation & RBAC</li>
            <li>Modern stack (Laravel API + Vite/React)</li>
            <li>CI/CD & container friendly</li>
            <li>Feature flags & capability gates</li>
          </ul>
        </aside>
        <div style={{display:"grid", gap:12}}>
          <h1 style={{fontSize:"clamp(28px, 5vw, 54px)", margin:0}}>All the boring stuff — done right</h1>
          <p className="muted" style={{margin:0}}>Focus on your moat, not the scaffolding.</p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginTop:12}}>
            <article className="card"><h3 style={{marginTop:0}}>Auth & Teams</h3><p className="muted">Email, OAuth, invites, roles.</p></article>
            <article className="card"><h3 style={{marginTop:0}}>Ops hooks</h3><p className="muted">Webhooks, queues, retries.</p></article>
            <article className="card"><h3 style={{marginTop:0}}>DX</h3><p className="muted">Hot reload, env safety, typed APIs.</p></article>
          </div>
          <div style={{marginTop:8}}><CTAGroup /></div>
        </div>
      </div>
    </section>
  );
}

function LayoutCards(){
  return (
    <section className="container" style={{padding:"40px 16px", display:"grid", gap:24}}>
      <div style={{display:"grid", gap:8, textAlign:"center"}}>
        <h1 style={{fontSize:"clamp(28px, 5vw, 54px)", margin:0}}>The fastest way to SaaS</h1>
        <p className="muted" style={{margin:0}}>Pick your tenant plan and ship.</p>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16}}>
        <article className="card"><h3 style={{marginTop:0}}>Multi‑tenant core</h3><p className="muted">Isolated tenants, scoped access.</p></article>
        <article className="card"><h3 style={{marginTop:0}}>Modern stack</h3><p className="muted">Laravel API + React/Vite.</p></article>
        <article className="card"><h3 style={{marginTop:0}}>Ops‑ready</h3><p className="muted">Auth, queues, and hooks.</p></article>
        <article className="card"><h3 style={{marginTop:0}}>Tooling</h3><p className="muted">DX that doesn’t fight you.</p></article>
      </div>
      <div style={{display:"grid", placeItems:"center", gap:16}}>
        <Logo size={420} />
        <CTAGroup />
      </div>
    </section>
  );
}

function Header({ onToggle, nocturne }){
  const flags = useFlags();
  const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <header style={{borderBottom:"1px solid var(--line)", position:"sticky", top:0, zIndex:10, backdropFilter:"saturate(140%) blur(6px)", background:"color-mix(in oklab, var(--bg) 84%, transparent)"}}>
      <div className="container" style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px"}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <Logo size={128} />
          <nav style={{display:"flex", gap:12}}>
            <button className="btn ghost" onClick={go("section-top")}>Top</button>
            <a className="btn ghost" href="/docs">Docs</a>
          </nav>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <button className="btn" onClick={onToggle}>{nocturne ? "☾ Nocturne" : "☀︎ Daylight"}</button>
          {flags.loginEnabled && <a className="btn" href="/login">Login</a>}
          {flags.registerEnabled && <a className="btn solid" href="/register">Get started</a>}
        </div>
      </div>
    </header>
  );
}

function Footer(){
  return (
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
  );
}

const registry = { classic: LayoutClassic, split: LayoutSplit, banner: LayoutBanner, sidebar: LayoutSidebar, cards: LayoutCards };

export default function AppPublicMultiLayout(){
  const [nocturne, setNocturne] = useState(false);
  useEffect(()=>{
    const root = document.querySelector(".yamato");
    if (root) root.classList.toggle("nocturne", nocturne);
  }, [nocturne]);

  const qs = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const key = (qs.get("layout") || "classic").toLowerCase();
  const Layout = registry[key] || registry.classic;

  return (
    <div id="section-top" className="yamato" style={{minHeight:"100dvh", display:"grid", gridTemplateRows:"auto 1fr auto"}}>
      <Header nocturne={nocturne} onToggle={()=>setNocturne(v=>!v)} />
      <main>
        <Layout />
      </main>
      <Footer />
    </div>
  );
}
  