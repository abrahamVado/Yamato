import React, { useEffect, useRef, useState } from "react";
import WaveDivider from "@/components/WaveDivider.jsx";
import atm_fire from "@assets/images/atm_fire.png";
import logo from "@assets/images/yamato-logo-blank.png";
import { ThemeToggle } from "@/providers/ThemeProvider.jsx";
import { useI18n, LangSelect } from "@/providers/I18nProvider.jsx";
import { scrollToEl, easeOutCubic } from "@/utils/scroll.js";
import ProgressFloat from "@/components/ProgressFloat.jsx";
import Button3D from "@/components/Button3D.jsx";
import { FloppyDiskIcon, ArrowRightIcon, SpinnerBallIcon } from "@phosphor-icons/react";



const Logo = ({ size = 120 }) => (
  <div style={{ display: "grid", placeItems: "center", width: size, height: size / 2 }}>
    <img src={logo} alt="Yamato logo" style={{ maxWidth: "100%", maxHeight: "100%" }} />
  </div>
);

const Feature = ({ icon, title, body }) => (
  <article className="feature card">
    <div className="feature__icon" aria-hidden="true">{icon}</div>
    <h3>{title}</h3>
    <p className="muted">{body}</p>
  </article>
);

const Plan = ({ name, price, blurb, features = [], featured, cta }) => (
  <article className={"plan card" + (featured ? " plan--featured" : "")}>
    <h3>{name}</h3>
    <div className="plan__price">{price}</div>
    <p className="muted">{blurb}</p>
    <ul className="plan__list">
      {features.map((f, i) => <li key={i}>{f}</li>)}
    </ul>
    <a className={"btn" + (featured ? " solid" : "")} href="/register">{cta}</a>
  </article>
);

export default function AppPublicBootsland() {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);
  const { t } = useI18n();

  useEffect(() => {
    if (rootRef.current) rootRef.current.classList.add("bootsland");
  }, []);

  const go = (id) => () => {
    const el = document.getElementById(id);
    scrollToEl(el, { duration: 220, easing: easeOutCubic }); // fast & smooth
    setMenuOpen(false);
  };

  return (
    <div ref={rootRef} className="yamato">
      <header className="bl-header">
        <div className="container bl-header__row">
          <div className="bl-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo/>
            <strong>{t("brand")}</strong>
          </div>

          <nav className={"bl-nav" + (menuOpen ? " is-open" : "")} aria-label="Primary">
            <button
              className="bl-nav__toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            >☰</button>

            <div className="bl-nav__links" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="btn ghost" onClick={go('home')}>{t("nav_home")}</button>
              <button className="btn ghost" onClick={go('features')}>{t("nav_features")}</button>
              <button className="btn ghost" onClick={go('showcase')}>{t("nav_showcase")}</button>
              <button className="btn ghost" onClick={go('pricing')}>{t("nav_pricing")}</button>
              <button className="btn ghost" onClick={go('faq')}>{t("nav_faq")}</button>
              <a className="btn" href="/login">{t("nav_login")}</a>
              <a className="btn solid" href="/register">{t("nav_get_started")}</a>
              <ThemeToggle />
              <LangSelect />
            </div>
          </nav>
        </div>
      </header>

    <div style={{background:"#0f2a66", minHeight:"100vh", padding:"40px", display:"grid", gap:"28px"}}>

      <h2>3D Buttons (React)</h2>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
<div className="button-flex-scope" style={{ "--gap": ".34em" }}>


  <Button3D
    label="Cargando"
    variant="sky"
    loading
    size="sm"
    spinnerWeight="bold"
    style={{ "--icon-mult": 1.50, "--spin-speed": "1.5s" }}
    disabled
  />


      <Button3D label="Deshabilitado" variant="gray" disabled />
      <Button3D
        label="Guardar"
        variant="emerald"
        leftIcon={<FloppyDiskIcon size={22} weight="bold" />}
        style={{ "--icon-mult": 1.40 }}
      />
    <Button3D
      label="Continuar"
      rightIcon={<ArrowRightIcon size={22} weight="bold" />}
      style={{ "--icon-mult": 1.40 }}
      size="lg"
      variant="purple"
    />
</div>
      </div>

    </div>
      <main>  
        {/* Section 1: HERO */}
        <section id="home" className="container bl-hero snap-section">
          <div className="bl-hero__copy">
            <span className="badge">{t("badge")}</span>
            <h1>{t("hero_h1")}</h1>
            <p className="lead">{t("hero_p")}</p>
            <div className="bl-cta">
              <a className="btn solid" href="/register">{t("start_free")}</a>
              <a className="btn" href="/docs">{t("view_docs")}</a>
            </div>
            <div className="bl-kpis" aria-label="Key metrics" style={{ display: "flex", gap: 24, marginTop: 12 }}>
              <div><b>5 min</b><small> {t("kpi_deploy")}</small></div>
              <div><b>∞</b><small> {t("kpi_tenants")}</small></div>
              <div><b>RBAC</b><small> {t("kpi_rbac")}</small></div>
            </div>
          </div>
          <div className="bl-hero__art">
            <img src={logo} alt="Yamato logo"/>
          </div>
        </section>

        {/* Divider band (non-snapping) */}
        <section className="bl-brands">
          <div aria-hidden="true">
            <WaveDivider className="wave wave--brand wave--drift wave--fast" />
          </div>
          <div aria-hidden="true">
            <WaveDivider className="wave wave--bg wave--flipY" />
          </div>
        </section>

        {/* Section 2: FEATURES */}
        <section id="features" className="container bl-features snap-section">
          <header className="section-head">
            <h2>{t("features_h2")}</h2>
            <p className="muted">{t("features_p")}</p>
          </header>
          <div className="grid grid--responsive">
            <Feature icon="🏷️" title={t("f1")} body={t("f1_p")} />
            <Feature icon="🔐" title={t("f2")} body={t("f2_p")} />
            <Feature icon="⚡" title={t("f3")} body={t("f3_p")} />
            <Feature icon="🧪" title={t("f4")} body={t("f4_p")} />
            <Feature icon="🧰" title={t("f5")} body={t("f5_p")} />
            <Feature icon="🚀" title={t("f6")} body={t("f6_p")} />
          </div>
        </section>

        {/* Section 3: SHOWCASE */}
        <section id="showcase" className="container bl-showcase snap-section">
          <div className="bl-show__image">
            <img src="/dashboard.png" alt="Dashboard screenshot"/>
          </div>
          <div className="bl-show__copy">
            <h2>{t("show_h2")}</h2>
            <p className="muted">{t("show_p")}</p>
            <ul className="bl-checks">
              <li>{t("show_li1")}</li>
              <li>{t("show_li2")}</li>
              <li>{t("show_li3")}</li>
            </ul>
            <div className="bl-cta">
              <a className="btn solid" href="/register">{t("nav_get_started")}</a>
              <a className="btn" href="/docs">{t("view_docs")}</a>
            </div>
          </div>
        </section>

        {/* Section 4: PRICING */}
        <section id="pricing" className="container bl-pricing snap-section">
          <header className="section-head">
            <h2>{t("pricing_h2")}</h2>
            <p className="muted">{t("pricing_p")}</p>
          </header>
          <div className="grid grid--responsive">
            <Plan
              name={t("plan_starter")}
              price="$0"
              blurb={t("plan_starter_blurb")}
              features={["3 members", "1 tenant", "Community support"]}
              cta={t("plan_choose")}
            />
            <Plan
              name={t("plan_team")}
              price="$49/mo"
              blurb={t("plan_team_blurb")}
              features={["20 members", "5 tenants", "Email support"]}
              featured
              cta={t("plan_start_now")}
            />
            <Plan
              name={t("plan_scale")}
              price="Contact us"
              blurb={t("plan_scale_blurb")}
              features={["Unlimited members", "Unlimited tenants", "SLA support"]}
              cta={t("plan_choose")}
            />
          </div>
        </section>

        {/* Section 5: FAQ */}
        <section id="faq" className="container bl-faq snap-section">
          <header className="section-head">
            <h2>{t("faq_h2")}</h2>
          </header>
          <details><summary>{t("faq1_q")}</summary><p>{t("faq1_a")}</p></details>
          <details><summary>{t("faq2_q")}</summary><p>{t("faq2_a")}</p></details>
          <details><summary>{t("faq3_q")}</summary><p>{t("faq3_a")}</p></details>
        </section>

        {/* CTA band (snaps too, if you want) */}
        <section className="bl-cta-band snap-section">
          <div className="container">
            <h2>{t("cta_h2")}</h2>
            <p className="muted">{t("cta_p")}</p>
            <div className="bl-cta">
              <a className="btn solid" href="/register">{t("nav_get_started")}</a>
              <a className="btn" href="/login">{t("nav_login")}</a>
            </div>
          </div>
        </section>





      </main>

      <footer className="site-footer">
        <div className="container bl-footer">
          <small>© {new Date().getFullYear()} {t("brand")} {t("footer_rights")}</small>
          <nav aria-label="Footer">
            <a className="btn ghost" href="#">Privacy</a>
            <a className="btn ghost" href="#">Terms</a>
            <a className="btn ghost" href="#">Status</a>
          </nav>
        </div>
      </footer>
      <div className="progress-track" aria-hidden />
      <ProgressFloat
        src={atm_fire}
        size={64}
        anchor="right"
        offset={20}
        trackHeight={280}
        sections={["home","features","showcase","pricing","faq"]}
      />

    </div>
  );
}
