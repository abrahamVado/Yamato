import React from 'react';
import Icon, { IconName } from '@/components/ui/Icons';

/**
 * Represents a navigation item in the sidebar.
 */
interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

const items: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'chevronRight' },
  { label: 'Documents', href: '/documents', icon: 'layers' },
  { label: 'Settings', href: '/settings', icon: 'palette' },
  { label: 'Profile', href: '/profile', icon: 'user' },
];

/**
 * Sidebar navigation for authenticated users.  You can highlight the active
 * route using your router of choice (e.g. React Router) or your own
 * custom logic.  Each item contains an icon and a label.
 */
export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        {items.map((item) => (
          <a key={item.href} href={item.href} className="sidebar-link">
            <Icon name={item.icon as IconName} size={18} className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}