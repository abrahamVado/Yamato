import React from 'react';
import Icon from '@/components/ui/Icons';

/**
 * Topbar for authenticated users.  Contains a search field, placeholder
 * actions and a user menu icon.  Extend this component with your own
 * notifications, theme toggles or dropdown menus.
 */
export default function Topbar() {
  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button className="icon-button" aria-label="Toggle sidebar">
          <Icon name="menu" size={20} />
        </button>
        <div className="search-wrapper">
          <Icon name="search" size={16} className="search-icon" />
          <input
            type="search"
            className="search-input"
            placeholder="Search…"
          />
        </div>
      </div>
      <div className="topbar-right">
        <button className="icon-button" aria-label="Notifications">
          <Icon name="bell" size={20} />
        </button>
        <button className="icon-button" aria-label="User menu">
          <Icon name="user" size={20} />
        </button>
      </div>
    </header>
  );
}