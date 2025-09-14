import React from 'react';
import Icon, { IconName } from '@/components/ui/Icons';

export interface MarketingCardProps {
  title: string;
  description: string;
  /** Name of the icon to display at the top of the card */
  icon?: IconName;
  /** Additional class names */
  className?: string;
}

/**
 * A simple marketing card used to highlight features or benefits.  Cards
 * support an optional icon, a title and a description.  You can extend
 * this component to include images, links or interactive content.
 */
export default function MarketingCard({ title, description, icon, className }: MarketingCardProps) {
  return (
    <div className={['marketing-card', className].filter(Boolean).join(' ')}>
      {icon && (
        <div className="marketing-card-icon">
          <Icon name={icon} size={32} />
        </div>
      )}
      <h3 className="marketing-card-title">{title}</h3>
      <p className="marketing-card-description">{description}</p>
    </div>
  );
}