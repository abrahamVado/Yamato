import React, { type ReactNode } from 'react';

export interface BentoCardProps {
  /** Title displayed at the top of the card */
  title: string;
  /** Card content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A flexible card component used in the Bento grid on the dashboard.  This
 * component accepts arbitrary children.  Use CSS grid or flexbox in your
 * layout to position cards of various sizes.
 */
export default function BentoCard({ title, children, className }: BentoCardProps) {
  return (
    <article className={['bento-card', className].filter(Boolean).join(' ')}>
      <header className="bento-card-header">
        <h3>{title}</h3>
      </header>
      <div className="bento-card-body">{children}</div>
    </article>
  );
}