import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarBrandProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  title?: string;
}

export const SidebarBrand: React.FC<SidebarBrandProps> = ({
  isCollapsed,
  onToggleCollapse,
  title = 'Note'
}) => {
  return (
    <div className="sidebar-brand-row">
      <div className="brand-identifier">
        <div className="brand-logo-mark" title={title}>
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
        {!isCollapsed && <span className="brand-title">{title}</span>}
      </div>

      <button
        type="button"
        className="collapse-toggle-btn"
        onClick={onToggleCollapse}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};
