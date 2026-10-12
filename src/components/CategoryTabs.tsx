import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onSelectTab
}) => {
  const tabs = ['All', 'Personal', 'Projects', 'Business'];

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
