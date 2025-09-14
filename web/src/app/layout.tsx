import React, { type ReactNode } from 'react';
// Import the umbrella stylesheet to ensure the SCSS bundles are compiled.
import '@/styles/app.scss';

/**
 * Root layout component.  In a Next.js project this would wrap all pages and
 * provide a place to import global CSS.  In this Vite scaffold it simply
 * returns its children.  Feel free to extend this component with
 * providers (e.g. theme, router) as needed.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}