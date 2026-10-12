import React from 'react';
import { LayoutGrid, Calendar } from 'lucide-react';
import { DEFAULT_CATEGORY_TABS } from '../../constants/categories';

export interface CategoryTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  tabs?: readonly string[] | string[];
  viewMode?: 'grid' | 'calendar';
  onToggleViewMode?: (mode: 'grid' | 'calendar') => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onSelectTab,
  tabs = DEFAULT_CATEGORY_TABS,
  viewMode = 'grid',
  onToggleViewMode
}) => {
  return (
    <div className="category-tabs-bar">
      <div className="tabs-group">
        {tabs.map((tab) => {
          const isActive =
            activeTab.toLowerCase() === tab.toLowerCase() ||
            (activeTab === 'Personal' && tab === 'Personal') ||
            (activeTab === 'Projects' && tab === 'Projects');

          return (
            <button
              key={tab}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(tab)}
              id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {onToggleViewMode && (
        <div className="cal-view-toggle" style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            className={`cal-toggle-item ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('grid')}
            title="Dạng danh sách / thẻ ghi chú"
            aria-label="Dạng thẻ"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            className={`cal-toggle-item ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('calendar')}
            title="Lịch ghi chú (Calendar)"
            aria-label="Dạng lịch"
          >
            <Calendar size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;
