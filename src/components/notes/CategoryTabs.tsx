import React from 'react';
import { DEFAULT_CATEGORY_TABS } from '../../constants/categories';

export interface CategoryTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  tabs?: readonly string[] | string[];
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onSelectTab,
  tabs = DEFAULT_CATEGORY_TABS
}) => {
  return (
    <div className="category-tabs-bar">
      <div className="tabs-group">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onSelectTab(tab)}
            id={`tab-${tab.toLowerCase()}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
