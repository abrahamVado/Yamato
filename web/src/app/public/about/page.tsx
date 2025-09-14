import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

/**
 * About page for the public section.  Replace the placeholder content with
 * your own team information and values.
 */
export default function AboutPage() {
  return (
    <>
      <PublicNavbar />
      <main className="container">
        <h1>About Us</h1>
        <p>
          Yamato is a modern UI kit built with React and SCSS.  We strive to
          provide developers with an intuitive, accessible component library
          and a flexible theming system that scales from marketing sites to
          complex applications.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}