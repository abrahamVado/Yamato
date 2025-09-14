import React from 'react';

export interface KpiTileProps {
  /** Unique identifier used as a key when rendering lists */
  id?: number | string;
  /** Label displayed below the value */
  label: string;
  /** The numeric value of the KPI */
  value: number | string;
  /** Optional prefix to display before the value (e.g. $) */
  prefix?: string;
  /** Optional suffix to display after the value (e.g. %) */
  suffix?: string;
}

/**
 * Displays a single key performance indicator as a compact tile.  Pass
 * in optional prefixes and suffixes to format numbers (e.g. currency).
 */
export default function KpiTile({ id, label, value, prefix = '', suffix = '' }: KpiTileProps) {
  return (
    <div className="kpi-tile" key={id}>
      <div className="kpi-value">
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}