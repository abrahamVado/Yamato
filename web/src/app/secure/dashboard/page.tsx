import React from 'react';
import Topbar from '@/components/secure/Topbar';
import Sidebar from '@/components/secure/Sidebar';
import KpiGrid from '@/components/secure/KpiGrid';
import BentoCard from '@/components/secure/BentoCard';

/**
 * Dashboard page for authenticated users.  Combines the sidebar and topbar
 * layout with KPI tiles and a bento-style widget area.  In a real app
 * data would be fetched from your API and passed into the KPI grid and
 * bento cards.
 */
export default function DashboardPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Topbar />
        <main className="dashboard-main">
          <KpiGrid
            kpis={[
              { id: 1, label: 'Active Users', value: 1250 },
              { id: 2, label: 'Revenue', value: 35250, prefix: '$' },
              { id: 3, label: 'Retention', value: 87, suffix: '%' },
            ]}
          />
          <div className="bento-grid">
            <BentoCard title="Getting Started">
              <p>Integrate the Yamato kit into your project and start
                building.</p>
            </BentoCard>
            <BentoCard title="Latest Activity">
              <p>Coming soon: a feed of recent events and user actions.</p>
            </BentoCard>
          </div>
        </main>
      </div>
    </div>
  );
}