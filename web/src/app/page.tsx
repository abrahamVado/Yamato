import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import Hero from '@/components/public/Hero';
import MarketingCard from '@/components/public/MarketingCard';
import WavePurple from '@/components/public/WavePurple';
import WaveBlue from '@/components/public/WaveBlue';
import WaveGreen from '@/components/public/WaveGreen';
import Icon from '@/components/ui/Icons';

export default function HomePage() {
  return (
    <>
      <PublicNavbar />

      {/* Section 1: hero */}
      <main>
        <Hero
          title="Welcome to Yamato"
          subtitle="Build secure, performant UIs with ease."
          ctaLabel="Get Started"
          onCtaClick={() => (window.location.href = '/docs')}
        />
        {/* Top wave divider (purple) */}
        <WavePurple variant="soft" height={180} drift speeds={[20, 15, 10]} />

        {/* Section 2: feature cards */}
        <section className="cards-section">
          <header className="section-head">
            <h2>Why teams pick Yamato</h2>
            <p className="muted">
              Composable design system, theming, and accessibility—without the boilerplate.
            </p>
          </header>
          <div className="cards-grid">
            <MarketingCard title="Modular design" description="Compose your UI from a library of proven components." icon="layers" />
            <MarketingCard title="Themeable" description="Support light/dark modes and custom brand colors out of the box." icon="palette" />
            <MarketingCard title="Accessible" description="A11y helpers baked into every component so you don't have to worry." icon="checkCircle" />
          </div>
        </section>
        {/* Wave divider (blue) */}
        <WaveBlue variant="aggro" height={200} drift speeds={[24, 18, 12]} />

        {/* Section 3: pillars & join/donate CTA */}
        <section className="cards-section">
          <header className="section-head">
            <h2>KPI-compliant SaaS, secure by default</h2>
            <p className="muted">
              We handle KPI catalogs, security controls, and reporting so you can focus on your product.
            </p>
          </header>
          {/* List of built-in pillars... (same as before) */}
          {/* CTA Buttons using button-flex styles */}
          <div className="button-flex-scope btn-container">
            <a className="button-flex btn--violet btn--md has-right-icon" href="https://github.com/your-org/your-repo" target="_blank">
              <span>Contribute Code</span>
              <span className="button-flex__icon button-flex__icon--right"><Icon name="arrowRight" size={18} /></span>
            </a>
            <a className="button-flex btn--emerald btn--md has-right-icon" href="/donate">
              <span>Donate</span>
              <span className="button-flex__icon button-flex__icon--right"><Icon name="checkCircle" size={18} /></span>
            </a>
          </div>
        </section>
        {/* Bottom wave divider (green) */}
        <WaveGreen variant="soft" height={160} drift speeds={[22, 16, 10]} />

      </main>

      <PublicFooter />
    </>
  );
}
