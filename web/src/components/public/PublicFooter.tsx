import React from 'react';

/**
 * Simple marketing site footer.  Includes copyright, social links and
 * additional navigation.  Extend this component with your own links and
 * contact information.
 */
export default function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="public-footer">
      <div className="footer-inner">
        <p className="footer-text">© {year} Yamato. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="/about" className="footer-link">About</a>
          <a href="/pricing" className="footer-link">Pricing</a>
          <a href="https://github.com" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}