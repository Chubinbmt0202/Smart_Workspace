import React, { useState } from 'react';
import {
  Search,
  SquarePen,
  ChevronLeft,
  ChevronRight,
  User,
  Inbox,
  Send,
  Clock,
  Settings,
  Bell,
  Trash2,
  Home
} from 'lucide-react';

interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenAddModal?: () => void;
  onToggleNotifications?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  dotColor: string;
  badge?: string;
}

const INBOX_SUBITEMS: SubMenuItem[] = [
  { id: 'primary', label: 'Primary', dotColor: '#3b82f6' },
  { id: 'business', label: 'Business', dotColor: '#ef4444' },
  { id: 'projects', label: 'Projects', dotColor: '#f59e0b', badge: '20+' },
  { id: 'game', label: 'Game', dotColor: '#8b5cf6' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab = 'projects',
  onSelectTab,
  onOpenAddModal,
  onToggleNotifications,
  searchQuery = '',
  onSearchChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inboxExpanded, setInboxExpanded] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleTabClick = (tabId: string) => {
    if (tabId === 'notifications' && onToggleNotifications) {
      onToggleNotifications();
    }
    onSelectTab?.(tabId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    onSearchChange?.(val);
  };

  return (
    <aside className={`acedesgin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* 1. Header: Logo + Brand + Collapse button */}
      <div className="sidebar-brand-row">
        <div className="brand-identifier">
          {/* Stylized geometric delta loop icon */}
          <div className="brand-logo-mark" title="Note">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="delta-logo-svg"
            >
              <path
                d="M12 4.2C12.55 4.2 13.06 4.5 13.33 4.98L20.25 17.02C20.8 17.98 20.1 19.2 18.99 19.2H5.01C3.9 19.2 3.2 17.98 3.75 17.02L10.67 4.98C10.94 4.5 11.45 4.2 12 4.2Z"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9.2L16.2 16.5H7.8L12 9.2Z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          {!isCollapsed && <span className="brand-title">Note</span>}
        </div>

        <button
          type="button"
          className="collapse-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* 2. Search & Compose Action Row */}
      {!isCollapsed && (
        <div className="sidebar-search-action-row">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={onSearchChange ? searchQuery : localSearch}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <button
            type="button"
            className="compose-action-btn"
            onClick={onOpenAddModal}
            title="Compose / New item"
            aria-label="Compose / New item"
          >
            <SquarePen size={16} />
          </button>
        </div>
      )}

      {/* 3. Navigation List */}
      <div className="sidebar-scrollable-content">
        {/* MAIN MENU Group */}
        <div className="sidebar-menu-group">
          {!isCollapsed && <div className="group-title">MAIN MENU</div>}

          {/* Account */}
          <button
            type="button"
            className={`menu-item ${currentTab === 'account' ? 'active' : ''}`}
            onClick={() => handleTabClick('account')}
            title="Home"
          >
            <Home size={18} className="item-icon" />
            {!isCollapsed && <span className="item-label">Home</span>}
          </button>

          {/* All Inboxes */}
          <div className="inbox-parent-container">
            <button
              type="button"
              className={`menu-item has-badge ${currentTab === 'all-inboxes' ||
                ['primary', 'business', 'projects', 'game'].includes(currentTab)
                ? 'parent-active'
                : ''
                }`}
              onClick={() => {
                setInboxExpanded(!inboxExpanded);
                handleTabClick('all-inboxes');
              }}
              title="All Inboxes"
            >
              <Inbox size={18} className="item-icon inbox-icon" />
              {!isCollapsed && (
                <>
                  <span className="item-label inbox-label">All Tags</span>
                </>
              )}
            </button>

            {/* Nested Sub-items */}
            {!isCollapsed && inboxExpanded && (
              <div className="sub-menu-tree">
                {INBOX_SUBITEMS.map((sub) => {
                  const isSubActive = currentTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`sub-menu-item ${isSubActive ? 'sub-active' : ''}`}
                      onClick={() => handleTabClick(sub.id)}
                    >
                      {/* Active indicator bar on tree line */}
                      {isSubActive && <span className="active-indicator-bar" />}
                      <span
                        className="colored-dot"
                        style={{ backgroundColor: sub.dotColor }}
                      />
                      <span className="sub-item-label">{sub.label}</span>
                      {sub.badge && (
                        <span className="badge-pill sub-badge">{sub.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scheduled */}
          <button
            type="button"
            className={`menu-item ${currentTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => handleTabClick('scheduled')}
            title="Scheduled"
          >
            <Clock size={18} className="item-icon" />
            {!isCollapsed && <span className="item-label">Scheduled</span>}
          </button>

          <button
            type="button"
            className={`menu-item ${currentTab === 'recycle' ? 'active' : ''}`}
            onClick={() => handleTabClick('recycle')}
            title="Recycle"
          >
            <Trash2 size={18} className="item-icon" />
            {!isCollapsed && <span className="item-label">Recycle bin</span>}
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
