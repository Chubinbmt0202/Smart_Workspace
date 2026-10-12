import React, { useState } from 'react';
import type { TagItem } from '../../../types/tag';
import { useSidebarTags } from '../../../hooks/useSidebarTags';
import { SidebarBrand } from './SidebarBrand';
import { SidebarSearch } from './SidebarSearch';
import { SidebarNav } from './SidebarNav';

export interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenAddModal?: () => void;
  onToggleNotifications?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onAddTag?: (tag: TagItem) => void;
  onDeleteTag?: (tagId: string) => void;
  renameTag?: (tagId: string, newName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab = 'projects',
  onSelectTab,
  onOpenAddModal,
  onToggleNotifications,
  searchQuery = '',
  onSearchChange,
  onAddTag,
  onDeleteTag,
  renameTag
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inboxExpanded, setInboxExpanded] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const {
    tags,
    isAddingTag,
    setIsAddingTag,
    newTagName,
    setNewTagName,
    hoveredDeleteTagId,
    setHoveredDeleteTagId,
    editingTagId,
    editingTagName,
    setEditingTagName,
    handleCreateTag,
    handleDeleteTag,
    handleStartRename,
    handleSaveRename,
    handleCancelRename
  } = useSidebarTags({
    onAddTag,
    onDeleteTag,
    renameTag,
    currentTab,
    onSelectTab
  });

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
      {/* 1. Header: Brand + Collapse toggle */}
      <SidebarBrand
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        title="Note"
      />

      {/* 2. Search & Compose actions */}
      {!isCollapsed && (
        <SidebarSearch
          searchQuery={onSearchChange ? searchQuery : localSearch}
          onSearchChange={handleSearchChange}
          onOpenAddModal={onOpenAddModal}
        />
      )}

      {/* 3. Navigation items & tags tree */}
      <SidebarNav
        isCollapsed={isCollapsed}
        currentTab={currentTab}
        inboxExpanded={inboxExpanded}
        tags={tags}
        isAddingTag={isAddingTag}
        newTagName={newTagName}
        editingTagId={editingTagId}
        editingTagName={editingTagName}
        hoveredDeleteTagId={hoveredDeleteTagId}
        onSelectTab={handleTabClick}
        onToggleInbox={() => {
          setInboxExpanded(!inboxExpanded);
          handleTabClick('all-inboxes');
        }}
        onStartAddTag={() => {
          setInboxExpanded(true);
          setIsAddingTag(true);
        }}
        onCancelAddTag={() => {
          setIsAddingTag(false);
          setNewTagName('');
        }}
        onChangeNewTagName={setNewTagName}
        onConfirmAddTag={handleCreateTag}
        onStartRenameTag={handleStartRename}
        onChangeEditingTagName={setEditingTagName}
        onConfirmRenameTag={handleSaveRename}
        onCancelRenameTag={handleCancelRename}
        onDeleteTag={handleDeleteTag}
        onMouseEnterDelete={(id) => setHoveredDeleteTagId(id)}
        onMouseLeaveDelete={() => setHoveredDeleteTagId(null)}
      />
    </aside>
  );
};

export default Sidebar;
