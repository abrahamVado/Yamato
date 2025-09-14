import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import Hero from '@/components/public/Hero';
import MarketingCard from '@/components/public/MarketingCard';

/**
 * The home page for the public site.  This page demonstrates how to compose
 * reusable marketing components.  In a real application you would fetch
 * content from an API or CMS and pass it as props.
 */
export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <Hero title="Welcome to Yamato" subtitle="Build secure, performant UIs with ease." />
        <section className="cards-section">
          <div className="cards-grid">
            <MarketingCard
              title="Modular design"
              description="Compose your UI from a library of proven components."
              icon="layers"
            />
            <MarketingCard
              title="Themeable"
              description="Support light/dark modes and custom brand colors out of the box."
              icon="palette"
            />
            <MarketingCard
              title="Accessible"
              description="A11y helpers baked into every component so you don't have to worry."
              icon="checkCircle"
            />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}