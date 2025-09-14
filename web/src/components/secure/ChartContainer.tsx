import React, { type ReactNode } from 'react';

export interface ChartContainerProps {
  /** Title displayed above the chart */
  title?: string;
  /** Chart or custom content to render inside the container */
  children?: ReactNode;
  className?: string;
}

/**
 * A lightweight wrapper for chart components.  Provides a heading and
 * responsive container that adapts to its parent's width and height.
 * Replace the children with your favourite chart library (e.g. Recharts,
 * Chart.js) to render actual data visualizations.
 */
export default function ChartContainer({ title, children, className }: ChartContainerProps) {
  return (
    <div className={['chart-container', className].filter(Boolean).join(' ')}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-content">{children ?? <p>No chart data</p>}</div>
    </div>
  );
}