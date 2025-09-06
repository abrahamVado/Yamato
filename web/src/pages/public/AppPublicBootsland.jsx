// Single-page landing inspired by Bootsland index3 (no router)
import React, { useEffect, useState } from "react";
import WaveDivider from "@/components/WaveDivider.jsx";
import logo from "@assets/images/yamato-logo-blank.png";

const Logo = ({ size = 120 }) => (
  <div style={{display:"grid",placeItems:"center",width:size,height:size/2}}>
    <img src={logo} alt="Yamato logo" style={{maxWidth:"100%",maxHeight:"100%"}}/>
  </div>
);

const BrandRow = () => (
  <div className="brands">
    <img src="/brand1.svg" alt="Brand A" />
    <img src="/brand2.svg" alt="Brand B" />
    <img src="/brand3.svg" alt="Brand C" />
    <img src="/brand4.svg" alt="Brand D" />
    <img src="/brand5.svg" alt="Brand E" />
  </div>
);

const Feature = ({ icon, title, body }) => (
  <article className="feature card">
    <div className="feature__icon" aria-hidden>{icon}</div>
    <h3>{title}</h3>
    <p className="muted">{body}</p>
  </article>
);

const Plan = ({ name, price, blurb, features = [], featured }) => (
  <article className={"plan card" + (featured ? " plan--featured" : "")}>
    <h3>{name}</h3>
    <div className="plan__price">{price}</div>
    <p className="muted">{blurb}</p>
    <ul className="plan__list">
      {features.map((f,i)=> <li key={i}>{f}</li>)}
    </ul>
    <a className={"btn" + (featured ? " solid" : "")} href="/register">{featured ? "Start now" : "Choose plan"}</a>
  </article>
);

export default function AppPublicBootsland(){
  const [nocturne, setNocturne] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(()=>{
    const root = document.querySelector(".yamato");
    if (root) root.classList.toggle("nocturne", nocturne);
  }, [nocturne]);

  const go = (id) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="yamato bootsland">
      <header className="bl-header">
        <div className="container bl-header__row">
          <div className="bl-brand">
            <Logo/>
            <strong>Yamato</strong>
          </div>
          <nav className={"bl-nav" + (menuOpen ? " is-open" : "")}>
            <button className="bl-nav__toggle" aria-label="Toggle menu" onClick={()=>setMenuOpen(v=>!v)}>☰</button>
            <div className="bl-nav__links">
              <button className="btn ghost" onClick={go('home')}>Home</button>
              <button className="btn ghost" onClick={go('features')}>Features</button>
              <button className="btn ghost" onClick={go('showcase')}>Showcase</button>
              <button className="btn ghost" onClick={go('pricing')}>Pricing</button>
              <button className="btn ghost" onClick={go('faq')}>FAQ</button>
              <a className="btn" href="/login">Login</a>
              <a className="btn solid" href="/register">Get started</a>
              <button className="btn" onClick={()=>setNocturne(v=>!v)}>{nocturne? "☾ Nocturne":"☀︎ Daylight"}</button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="container bl-hero">
          <div className="bl-hero__copy">
            <span className="badge">Multi‑tenant SaaS boilerplate</span>
            <h1>Ship production‑ready SaaS, fast.</h1>
            <p className="lead">Tenants, auth, roles, and a modern React/Vite frontend — tuned for speed and DX.</p>
            <div className="bl-cta">
              <a className="btn solid" href="/register">Start free</a>
              <a className="btn" href="/docs">View docs</a>
            </div>
            <div className="bl-kpis">
              <div><b>5 min</b><small>to first deploy</small></div>
              <div><b>∞</b><small>tenants</small></div>
              <div><b>RBAC</b><small>built‑in</small></div>
            </div>
          </div>
          <div className="bl-hero__art">
            <img src={logo} alt="Yamato logo"/>
          </div>
        </section>

        <section className="bl-brands">
 <div aria-hidden>
  <WaveDivider className="wave wave--brand wave--drift wave--fast" />
</div>
<section className="bl-cta-band">…</section>
<div aria-hidden>
  <WaveDivider className="wave wave--bg wave--flipY" />
</div>

        </section>

        <section id="features" className="container bl-features">
          <header className="section-head">
            <h2>Everything you need</h2>
            <p className="muted">Stop wiring the basics — build your advantage.</p>
          </header>
          <div className="grid grid--responsive">
            <Feature icon="🏷️" title="Tenants & Billing" body="Isolated tenants with hooks to connect your billing provider."/>
            <Feature icon="🔐" title="Auth & Teams" body="Email/OAuth login, invites, roles and capabilities."/>
            <Feature icon="⚡" title="Modern stack" body="Laravel API + React/Vite + Postgres/Redis."/>
            <Feature icon="🧪" title="Testing ready" body="Great DX with hot reload and typed front/back contracts."/>
            <Feature icon="🧰" title="Ops hooks" body="Queues, retries, and webhooks patterns built‑in."/>
            <Feature icon="🚀" title="CI/CD friendly" body="12‑factor configs, container‑first, cloud ready."/>
          </div>
        </section>

        <section id="showcase" className="container bl-showcase">
          <div className="bl-show__image">
            <img src="/dashboard.png" alt="Dashboard screenshot"/>
          </div>
          <div className="bl-show__copy">
            <h2>Launch features, not scaffolding</h2>
            <p className="muted">Yamato’s foundation covers tenancy, auth, and ops so you can focus on what makes your product different.</p>
            <ul className="bl-checks">
              <li>Tenant isolation, per‑route guards</li>
              <li>Capability flags on the client</li>
              <li>Docs and examples for common flows</li>
            </ul>
            <div className="bl-cta">
              <a className="btn solid" href="/register">Create tenant</a>
              <a className="btn" href="/docs">Read the docs</a>
            </div>
          </div>
        </section>

        <section id="pricing" className="container bl-pricing">
          <header className="section-head">
            <h2>Simple, predictable pricing</h2>
            <p className="muted">Start free, grow when you do.</p>
          </header>
          <div className="grid grid--responsive">
            <Plan name="Starter" price="$0" blurb="For hobby and evaluation" features={["3 members","1 tenant","Community support"]}/>
            <Plan name="Team" price="$49/mo" blurb="For growing teams" features={["20 members","5 tenants","Email support"]} featured/>
            <Plan name="Scale" price="Contact us" blurb="For orgs with custom needs" features={["Unlimited members","Unlimited tenants","SLA support"]}/>
          </div>
        </section>

        <section id="faq" className="container bl-faq">
          <header className="section-head">
            <h2>Frequently asked questions</h2>
          </header>
          <details><summary>Can I self‑host?</summary><p>Yes. API + web are container‑friendly; Postgres & Redis first‑class.</p></details>
          <details><summary>Custom domains per tenant?</summary><p>Yep. Map a domain and set tenant context at edge/middleware.</p></details>
          <details><summary>Does Yamato include RBAC?</summary><p>Yes. Server‑side roles and permissions with per‑route guards.</p></details>
        </section>

        <section className="bl-cta-band">
          <div className="container">
            <h2>Ready to ship?</h2>
            <p className="muted">Create your first tenant in minutes.</p>
            <div className="bl-cta">
              <a className="btn solid" href="/register">Get started</a>
              <a className="btn" href="/login">Login</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container bl-footer">
          <small>© {new Date().getFullYear()} Yamato — Multi‑tenant SaaS boilerplate</small>
          <nav>
            <a className="btn ghost" href="#">Privacy</a>
            <a className="btn ghost" href="#">Terms</a>
            <a className="btn ghost" href="#">Status</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
