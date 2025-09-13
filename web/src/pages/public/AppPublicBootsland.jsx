import React, { useEffect, useRef, useState } from "react";
import WaveDivider from "@/components/WaveDivider.jsx";
import logo from "@assets/images/yamato-logo-blank.png";

import { ThemeToggle } from "@/providers/ThemeToggle.jsx";
import { useI18n, LangSelect } from "@/providers/I18nProvider.jsx";
import { scrollToEl, easeOutCubic } from "@/utils/scroll.js";
import WavePurple from "@/components/WavePurple";


import Button3D from "@/components/Button3D.jsx";
import { ArrowRightIcon } from "@phosphor-icons/react";
const BTC_ADDR   = import.meta.env.VITE_BTC_BINANCE_ADDR || "bc1q-your-binance-btc-address-here";
const BTC_NET    = "BTC (SegWit)";
const BTC_URI    = `bitcoin:${BTC_ADDR}`;
const copyToClipboard = (t) => navigator.clipboard?.writeText(t).catch(() => {});

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
          </section>
          <div className="cap cap--bottom" aria-hidden>
            <WavePurple height={170}/>
          </div>          
          <div className="cap cap--top" aria-hidden>
            <WavePurple height={340} flip />
          </div>
          <section
            id="join"
            className="snap-section section"
            style={{ "--section-bg": COLORS.join }}
          >


            <div className="container">
              <header className="section-head">
                <h2>KPI-compliant SaaS, secure by default</h2>
                <p className="muted">
                  We handle the foundation—KPI catalogs & tracking, security controls, and a real reporting pipeline—so you can focus on the value only you can build.
                </p>
              </header>

              <div className="grid" style={{ gap: 16 }}>
                {/* Pillars */}
                <article className="card" style={{ padding: 16 }}>
                  <h3>What’s built-in</h3>
                  <ul
                    role="list"
                    style={{
                      marginTop: 8,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 12,
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    <li className="mini" style={{ display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 700 }}>📊 KPI-first</div>
                      <div style={{ opacity: 0.9 }}>
                        Define & enforce user/tenant KPIs with thresholds, alerts, and full audit history.
                      </div>
                    </li>
                    <li className="mini" style={{ display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 700 }}>🔒 Security by default</div>
                      <div style={{ opacity: 0.9 }}>
                        Least-privilege RBAC, audit logs, secrets hygiene, 2FA hooks, and encryption guidance.
                      </div>
                    </li>
                    <li className="mini" style={{ display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 700 }}>📈 Reporting that answers</div>
                      <div style={{ opacity: 0.9 }}>
                        Semantic metrics layer, scheduled reports, CSV/Parquet exports, and drill-downs.
                      </div>
                    </li>
                    <li className="mini" style={{ display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 700 }}>🚀 Ready-to-run SaaS</div>
                      <div style={{ opacity: 0.9 }}>
                        Multi-tenant scaffolding, billing hooks, email/i18n templates, and clean APIs from day one.
                      </div>
                    </li>
                  </ul>

                  <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
                    Guides for SOC2/GDPR readiness included; certifications depend on your deployment.
                  </p>
                </article>

                {/* Donations: BTC (Binance) only */}
                <article className="card" style={{ padding: 16 }}>
                  <h3>Support development (BTC only)</h3>
                  <p style={{ marginTop: 6 }}>
                    We route all donations exclusively to our <strong>Binance Bitcoin</strong> wallet to keep accounting simple and transparent.
                  </p>

                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gap: 8,
                      alignItems: "start",
                      gridTemplateColumns: "1fr",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span
                        className="badge"
                        style={{
                          fontSize: 12,
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "var(--purple-soft, #f1efff)",
                          border: "1px solid var(--line, #ececf6)",
                        }}
                      >
                        Network: {BTC_NET}
                      </span>
                      <span
                        className="badge"
                        style={{
                          fontSize: 12,
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "var(--purple-soft, #f1efff)",
                          border: "1px solid var(--line, #ececf6)",
                        }}
                      >
                        Exchange: Binance
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: 6 }}>
                      <label style={{ fontSize: 12, opacity: 0.85 }}>BTC address</label>
                      <code
                        style={{
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "1px solid var(--line, #ececf6)",
                          background: "var(--panel, #fff)",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {BTC_ADDR}
                      </code>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Button3D size="sm" variant="emerald" label="Copy BTC address" onClick={() => copyToClipboard(BTC_ADDR)} />
                        <Button3D size="sm" variant="slate"   label="Open in wallet"   href={BTC_URI} />
                        <Button3D size="sm" variant="azure"   label="How funds are used" href="/sponsor" />
                      </div>
                    </div>

                    <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                      <li style={{ fontSize: 12, opacity: 0.85 }}>
                        <strong>BTC network only.</strong> Do not send via Lightning, BEP20, TRC20, or other networks.
                      </li>
                      <li style={{ fontSize: 12, opacity: 0.85 }}>
                        <strong>No memo/tag required</strong> for BTC (SegWit) deposits.
                      </li>
                      <li style={{ fontSize: 12, opacity: 0.85 }}>
                        Monthly transparency: we publish incoming totals and how funds are allocated.
                      </li>
                    </ul>
                  </div>
                </article>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button3D
                  label="Start with the KPI pack"
                  href="/register"
                  variant="emerald"
                  size="md"
                  rightIcon={<ArrowRightIcon />}
                />
                <Button3D
                  label="Security & reporting docs"
                  href="/docs"
                  variant="slate"
                  size="md"
                />
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="site-footer">
      <div className="cap cap--bottom" aria-hidden>
        <WavePurple height={444}/>
          <div className="container bl-footer">
            <small>© {new Date().getFullYear()} {t("brand")} {t("footer_rights")}</small>
            <nav aria-label="Footer" style={{ display: "flex", gap: 8 }}>
              <Button3D label="Privacy" href="#" variant="slate" size="sm" />
              <Button3D label="Terms"   href="#" variant="slate" size="sm" />
              <Button3D label="Status"  href="#" variant="slate" size="sm" />
            </nav>
          </div>        
      </div>            
        </footer>
      </div>
    </div>
  );
}
