import React, { useState, type ReactNode } from 'react';

export interface TabDefinition {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabDefinition[];
  defaultIndex?: number;
  className?: string;
}

/**
 * A basic tabs component.  Accepts an array of tab definitions and
 * maintains the active tab state internally.  The first tab is active by
 * default unless a defaultIndex is provided.
 */
export default function Tabs({ tabs, defaultIndex = 0, className }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <div className={['tabs', className].filter(Boolean).join(' ')}>
      <div role="tablist" className="tab-list">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={active === idx}
            className={active === idx ? 'tab tab--active' : 'tab'}
            onClick={() => setActive(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-panels">
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            role="tabpanel"
            hidden={active !== idx}
            className="tab-panel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}