import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

/**
 * Pricing page for the public site.  Demonstrates how you might structure
 * pricing tiers and call-to-action elements.  Replace the placeholder
 * content with your own plans and pricing logic.
 */
export default function PricingPage() {
  return (
    <>
      <PublicNavbar />
      <main className="container">
        <h1>Pricing</h1>
        <p>Choose the plan that fits your needs.  All plans include free
          access to our open source components and documentation.</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h2>Starter</h2>
            <p className="price">Free</p>
            <ul>
              <li>Basic components</li>
              <li>Community support</li>
              <li>MIT License</li>
            </ul>
            <button className="btn btn-primary">Get started</button>
          </div>
          <div className="pricing-card">
            <h2>Pro</h2>
            <p className="price">$49/mo</p>
            <ul>
              <li>All components</li>
              <li>Priority support</li>
              <li>Commercial license</li>
            </ul>
            <button className="btn btn-primary">Buy now</button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}