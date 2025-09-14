import React from 'react';
import Icon, { IconName } from '@/components/ui/Icons';

export interface HeroProps {
  /** Main heading for the hero section */
  title: string;
  /** Subheading or supporting text */
  subtitle?: string;
  /** Optional call-to-action label */
  ctaLabel?: string;
  /** Optional icon to display next to the call-to-action */
  ctaIcon?: IconName;
  /** Handler invoked when the call-to-action is clicked */
  onCtaClick?: () => void;
}

/**
 * A marketing hero section with a title, optional subtitle and call‐to‐action.
 * Use this at the top of public pages to introduce your product or feature.
 */
export default function Hero({
  title,
  subtitle,
  ctaLabel,
  ctaIcon,
  onCtaClick,
}: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {ctaLabel && (
          <button
            type="button"
            className="btn btn-primary hero-cta"
            onClick={onCtaClick}
          >
            {ctaLabel}
            {ctaIcon && (
              <span className="icon-right">
                <Icon name={ctaIcon} size={20} />
              </span>
            )}
          </button>
        )}
      </div>
    </section>
  );
}