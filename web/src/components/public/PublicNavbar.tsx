import React from 'react';
import Icon from '@/components/ui/Icons';

/**
 * The marketing site navigation bar.  Shows a brand logo and basic
 * navigation links.  Customize the markup and styles to fit your brand.
 */
export default function PublicNavbar() {
  return (
    <header className="public-navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <Icon name="layers" size={20} />
          <span className="brand-text">Yamato</span>
        </a>
        <nav className="navbar-nav">
          <a href="/about" className="nav-link">About</a>
          <a href="/pricing" className="nav-link">Pricing</a>
          <a href="#" className="nav-link nav-link--cta">
            <span>Get Started</span>
            <Icon name="arrowRight" size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}