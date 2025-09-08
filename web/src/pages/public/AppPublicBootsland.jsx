import React, { useEffect, useRef, useState } from "react";
import WaveDivider from "@/components/WaveDivider.jsx";
import logo from "@assets/images/yamato-logo-blank.png";

import { ThemeToggle } from "@/providers/ThemeToggle.jsx";
import { useI18n, LangSelect } from "@/providers/I18nProvider.jsx";
import { scrollToEl, easeOutCubic } from "@/utils/scroll.js";

import Button3D from "@/components/Button3D.jsx";
import { ArrowRightIcon } from "@phosphor-icons/react";
import BentoShowcase from "@/components/bento/BentoShowcase.jsx";

const Logo = ({ size = 120, onClick }) => (
  <a onClick={onClick} style={{ display: "grid", placeItems: "center", width: size, height: size / 2 }}>
    <img src={logo} alt="Yamato logo" style={{ maxWidth: "100%", maxHeight: "100%" }} />
  </a>  
);

const FeatureCard = ({ icon, title, body }) => (
  <article className="feature card" style={{ padding: 16 }}>
    <div className="feature__icon" aria-hidden="true" style={{ fontSize: 28 }}>{icon}</div>
    <h3 style={{ marginTop: 8 }}>{title}</h3>
    <p className="muted">{body}</p>
  </article>
);

// Section background colors via CSS vars
const COLORS = {
  home:  "var(--c-hero)",
  build: "var(--c-features)",
  join:  "var(--c-cta)",
};

export default function AppPublicBootsland() {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);
  const { t } = useI18n();

  useEffect(() => {
    if (rootRef.current) rootRef.current.classList.add("bootsland");
  }, []);

  const go = (id) => () => {
    const el = document.getElementById(id);
    if (el) scrollToEl(el, { duration: 220, easing: easeOutCubic });
    setMenuOpen(false);
  };

  const wallets = [
    { chain: "Bitcoin",       addr: "bc1q-your-btc-address" },
    { chain: "Ethereum",      addr: "0xYourEthAddress" },
    { chain: "Solana",        addr: "YourSolAddress" },
    { chain: "USDT (TRC20)",  addr: "TYourTRONAddress" },
  ];

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); alert("Copied!"); }
    catch { /* ignore */ }
  };

  return (
    <div className="button-flex-scope">
      <div ref={rootRef} className="yamato">
        {/* Header */}
        <header className="bl-header">
          <div className="container bl-header__row">
            <div className="bl-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Logo onClick={go('home')} />
              <strong>{t("brand")}</strong>
            </div>

            <nav className={"bl-nav" + (menuOpen ? " is-open" : "")} aria-label="Primary">
              <Button3D
                label="☰"
                size="sm"
                variant="graphite"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(v => !v)}
                className="bl-nav__toggle"
                style={{ "--pad-x": ".75em" }}
              />
              <div className="bl-nav__links" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Button3D label="Home"  variant="slate" size="sm" onClick={go('home')} />
                <Button3D label="Build" variant="slate" size="sm" onClick={go('build')} />
                <Button3D label="Join"  variant="slate" size="sm" onClick={go('join')} />
                <Button3D label={t("nav_login")}       href="/login"    variant="azure"   size="sm" rightIcon={<ArrowRightIcon />} />
                <Button3D label={t("nav_get_started")} href="/register" variant="emerald" size="sm" rightIcon={<ArrowRightIcon />} />
                <ThemeToggle />
                <LangSelect />
              </div>
            </nav>
          </div>
        </header>

        <main>

          {/* ===================== Section 1: HOME (full width) ===================== */}
          <section
            id="home"
            className="bl-hero snap-section section"
            style={{ "--section-bg": COLORS.home }}
          >
            <div className="container">
              <div className="bl-hero__copy">
                <span className="badge">{t("badge")}</span>
                <h1>{t("hero_h1") || "Ship production-ready SaaS, fast."}</h1>
                <p className="lead">
                  {t("hero_p") || "Tenants, auth, roles, and a modern React/Vite frontend — tuned for speed and DX."}
                </p>
                <div className="bl-cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Button3D label={t("start_free") || "Start free"} href="/register" variant="emerald" size="md" rightIcon={<ArrowRightIcon />} />
                  <Button3D label={t("view_docs") || "View docs"}   href="/docs"     variant="slate"   size="md" />
                </div>
                <div className="bl-kpis" aria-label="Key metrics" style={{ display: "flex", gap: 24, marginTop: 12 }}>
                  <div><b>5 min</b><small> {t("kpi_deploy") || "to first deploy"}</small></div>
                  <div><b>∞</b><small> {t("kpi_tenants") || "tenants"}</small></div>
                  <div><b>RBAC</b><small> {t("kpi_rbac") || "built-in"}</small></div>
                </div>
              </div>
            </div>
            <div className="cap cap--bottom" aria-hidden>
              <WaveDivider height={160} color={COLORS.home} />
            </div>
          </section>
          {/* ===================== Section 1: HOME (full width) ===================== */}
          <BentoShowcase id="home" style={{ "--section-bg": COLORS.home }} />

          {/* ===================== Section 3: MISSION / JOIN (full width) ===================== */}
          <section
            id="join"
            className="snap-section section"
            style={{ "--section-bg": COLORS.join }}
          >
            <div className="cap cap--top" aria-hidden>
              <WaveDivider height={160} color={COLORS.join} flip />
            </div>

            <div className="container">
              <header className="section-head">
                <h2>Why we built this</h2>
                <p className="muted">
                  We're tired of re-wiring the same basics. This project focuses on the unglamorous foundation so you can build the unique value.
                </p>
              </header>

              <div className="grid" style={{ gap: 16 }}>
                <article className="card" style={{ padding: 16 }}>
                  <h3>Our promise</h3>
                  <p>
                    Practical defaults, clean APIs, and transparency. We document decisions and accept contributions that improve the whole stack.
                  </p>
                </article>

                <article className="card" style={{ padding: 16 }}>
                  <h3>Become a <em>socio</em> (member)</h3>
                  <p>
                    Support the project, get a say in the roadmap, and vote on major changes. Crypto donations are welcome:
                  </p>
                  <ul style={{ marginTop: 8 }}>
                    {wallets.map((w) => (
                      <li key={w.chain} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <code style={{ whiteSpace: "nowrap" }}>{w.chain}:</code>
                        <code style={{ overflowWrap: "anywhere" }}>{w.addr}</code>
                        <Button3D size="sm" variant="slate" label="Copy" onClick={() => copy(w.addr)} />
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <Button3D label="Join discussions" href="/community" variant="azure" size="sm" />
                    <Button3D label="Sponsor on GitHub" href="/sponsor"   variant="emerald" size="sm" />
                  </div>
                </article>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button3D label="Get started" href="/register" variant="emerald" size="md" rightIcon={<ArrowRightIcon />} />
                <Button3D label="Read the docs" href="/docs"   variant="slate"   size="md" />
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="site-footer">
          <div className="container bl-footer">
            <small>© {new Date().getFullYear()} {t("brand")} {t("footer_rights")}</small>
            <nav aria-label="Footer" style={{ display: "flex", gap: 8 }}>
              <Button3D label="Privacy" href="#" variant="slate" size="sm" />
              <Button3D label="Terms"   href="#" variant="slate" size="sm" />
              <Button3D label="Status"  href="#" variant="slate" size="sm" />
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
