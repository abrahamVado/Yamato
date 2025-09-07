import React, { useEffect, useRef, useState } from "react";
import WaveDivider from "@/components/WaveDivider.jsx";
import atm_fire from "@assets/images/atm_fire.png";
import logo from "@assets/images/yamato-logo-blank.png";
import { ThemeToggle } from "@/providers/ThemeToggle.jsx";
import { useI18n, LangSelect } from "@/providers/I18nProvider.jsx";
import { scrollToEl, easeOutCubic } from "@/utils/scroll.js";
import ProgressFloat from "@/components/ProgressFloat.jsx";
import Button3D from "@/components/Button3D.jsx";
import { ArrowRightIcon } from "@phosphor-icons/react"; // keep icons minimal & known-good

const Logo = ({ size = 120, onClick }) => (
  <a onClick={onClick} style={{ display: "grid", placeItems: "center", width: size, height: size / 2 }}>
    <img src={logo} alt="Yamato logo" style={{ maxWidth: "100%", maxHeight: "100%" }} />
  </a>
);

const Feature = ({ icon, title, body }) => (
  <article className="feature card">
    <div className="feature__icon" aria-hidden="true">{icon}</div>
    <h3>{title}</h3>
    <p className="muted">{body}</p>
  </article>
);

// Plan now uses Button3D for its CTA
const Plan = ({ name, price, blurb, features = [], featured, cta, ctaHref = "/register" }) => (
  <article className={"plan card" + (featured ? " plan--featured" : "")}>
    <h3>{name}</h3>
    <div className="plan__price">{price}</div>
    <p className="muted">{blurb}</p>
    <ul className="plan__list">
      {features.map((f, i) => <li key={i}>{f}</li>)}
    </ul>
    <div style={{ marginTop: 12 }}>
      <Button3D
        label={cta}
        href={ctaHref}
        size="sm"
        variant={featured ? "emerald" : "slate"}
        rightIcon={<ArrowRightIcon />}
      />
    </div>
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
    scrollToEl(el, { duration: 220, easing: easeOutCubic });
    setMenuOpen(false);
  };

  return (
    <div className="button-flex-scope">
      <div ref={rootRef} className="yamato">
        <header className="bl-header">
          <div className="container bl-header__row">
            <div className="bl-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Logo onClick={go('home')} />
              <strong>{t("brand")}</strong>
            </div>

            <nav className={"bl-nav" + (menuOpen ? " is-open" : "")} aria-label="Primary">
              {/* Menu toggle as Button3D */}
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
                {/* <Button3D label={t("nav_home")}      variant="slate" size="sm" onClick={go('home')} /> */}
                {/* <Button3D label={t("nav_features")}  variant="slate" size="sm" onClick={go('features')} /> */}
                {/* <Button3D label={t("nav_showcase")}  variant="slate" size="sm" onClick={go('showcase')} /> */}
                {/* <Button3D label={t("nav_pricing")}   variant="slate" size="sm" onClick={go('pricing')} /> */}
                {/* <Button3D label={t("nav_faq")}       variant="slate" size="sm" onClick={go('faq')} /> */}
                <Button3D label={t("nav_login")}     href="/login"    variant="azure"   size="sm" rightIcon={<ArrowRightIcon />} />
                <Button3D label={t("nav_get_started")} href="/register" variant="emerald" size="sm" rightIcon={<ArrowRightIcon />} />
                <ThemeToggle />
                <LangSelect />
              </div>
            </nav>
          </div>
        </header>

        <main>
          {/* Section 1: HERO */}
          <section id="home" className="container bl-hero snap-section">
            <div className="bl-hero__copy">
              <span className="badge">{t("badge")}</span>
              <h1>{t("hero_h1")}</h1>
              <p className="lead">{t("hero_p")}</p>
              <div className="bl-cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button3D
                  label={t("start_free")}
                  href="/register"
                  variant="emerald"
                  size="md"
                  rightIcon={<ArrowRightIcon />}
                />
                <Button3D
                  label={t("view_docs")}
                  href="/docs"
                  variant="slate"
                  size="md"
                />
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
              <div className="bl-cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button3D
                  label={t("nav_get_started")}
                  href="/register"
                  variant="emerald"
                  size="md"
                  rightIcon={<ArrowRightIcon />}
                />
                <Button3D
                  label={t("view_docs")}
                  href="/docs"
                  variant="slate"
                  size="md"
                />
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
                ctaHref="/register"
              />
              <Plan
                name={t("plan_team")}
                price="$49/mo"
                blurb={t("plan_team_blurb")}
                features={["20 members", "5 tenants", "Email support"]}
                featured
                cta={t("plan_start_now")}
                ctaHref="/register"
              />
              <Plan
                name={t("plan_scale")}
                price="Contact us"
                blurb={t("plan_scale_blurb")}
                features={["Unlimited members", "Unlimited tenants", "SLA support"]}
                cta={t("plan_choose")}
                ctaHref="/register"
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

          {/* CTA band */}
          <section className="bl-cta-band snap-section">
            <div className="container">
              <h2>{t("cta_h2")}</h2>
              <p className="muted">{t("cta_p")}</p>
              <div className="bl-cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button3D
                  label={t("nav_get_started")}
                  href="/register"
                  variant="emerald"
                  size="md"
                  rightIcon={<ArrowRightIcon />}
                />
                <Button3D
                  label={t("nav_login")}
                  href="/login"
                  variant="azure"
                  size="md"
                />
              </div>
            </div>
          </section>
        </main>

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
    </div>
  );
}
