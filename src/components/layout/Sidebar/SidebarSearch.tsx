import React from 'react';
import { Search, SquarePen } from 'lucide-react';

interface SidebarSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenAddModal?: () => void;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal
}) => {
  return (
    <div className="sidebar-search-action-row">
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={onSearchChange}
          className="search-input"
        />
      </div>

      <button
        type="button"
        className="compose-action-btn"
        onClick={onOpenAddModal}
        title="Compose / New note"
        aria-label="Compose / New note"
      >
        <SquarePen size={16} />
      </button>
    </div>
  );
};
