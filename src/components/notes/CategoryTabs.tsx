import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { DEFAULT_CATEGORY_TABS } from '../../constants/categories';

export interface CategoryTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  tabs?: readonly string[] | string[];
  onAddTag?: (tagName: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onSelectTab,
  tabs = DEFAULT_CATEGORY_TABS,
  onAddTag
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTagName.trim();
    if (trimmed && onAddTag) {
      onAddTag(trimmed);
      setNewTagName('');
      setIsAdding(false);
    } else {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTagName('');
    }
  };

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
    </div>
  );
};

export default CategoryTabs;
