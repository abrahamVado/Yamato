import React from 'react';
import KpiTile, { KpiTileProps } from './KpiTile';

export interface KpiGridProps {
  kpis: KpiTileProps[];
}

/**
 * Renders a responsive grid of KPI tiles.  Accepts an array of KPI
 * definitions and passes them on to the KpiTile component.  The layout
 * styles (e.g. grid-template-columns) are defined in SCSS.
 */
export default function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="kpi-grid">
      {kpis.map((kpi) => (
        <KpiTile key={kpi.id ?? kpi.label} {...kpi} />
      ))}
    </div>
  );
}