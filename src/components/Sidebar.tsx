import React, { useState } from 'react';
import {
  Search,
  SquarePen,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Clock,
  Trash2,
  Home,
  Plus,
  Check,
  X,
  Trash,
  Pencil
} from 'lucide-react';

interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenAddModal?: () => void;
  onToggleNotifications?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onAddTag?: (tag: { id: string; label: string; dotColor: string }) => void;
  onDeleteTag?: (tagId: string) => void;
  renameTag?: (tagId: string, newName: string) => void;
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
  { id: 'projects', label: 'Projects', dotColor: '#f59e0b' },
  { id: 'game', label: 'Game', dotColor: '#8b5cf6' }
];

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
  const [tags, setTags] = useState<SubMenuItem[]>(INBOX_SUBITEMS);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [hoveredDeleteTagId, setHoveredDeleteTagId] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const handleStartRename = (e: React.MouseEvent, tag: SubMenuItem) => {
    e.stopPropagation();
    setEditingTagId(tag.id);
    setEditingTagName(tag.label);
  };

  const handleSaveRename = (tagId: string) => {
    const trimmed = editingTagName.trim();
    if (trimmed) {
      setTags((prev) =>
        prev.map((t) => (t.id === tagId ? { ...t, label: trimmed } : t))
      );
      renameTag?.(tagId, trimmed);
    }
    setEditingTagId(null);
    setEditingTagName('');
  };

  const handleCancelRename = () => {
    setEditingTagId(null);
    setEditingTagName('');
  };

  const handleDeleteTag = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    onDeleteTag?.(tagId);
    if (currentTab === tagId) {
      handleTabClick('all-inboxes');
    }
  };

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

  const handleCreateTag = () => {
    const trimmed = newTagName.trim();
    if (!trimmed) {
      setIsAddingTag(false);
      return;
    }

    const colorPalette = ['#10b981', '#06b6d4', '#ec4899', '#8b5cf6', '#f97316', '#14b8a6', '#6366f1'];
    const randomColor = colorPalette[tags.length % colorPalette.length];
    const newTagId = trimmed.toLowerCase().replace(/\s+/g, '-');

    const newTag: SubMenuItem = {
      id: newTagId,
      label: trimmed,
      dotColor: randomColor
    };

    setTags((prev) => [...prev, newTag]);
    setNewTagName('');
    setIsAddingTag(false);
    onAddTag?.(newTag);
    handleTabClick(newTagId);
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

          {/* All Inboxes / All Tags */}
          <div className="inbox-parent-container">
            <button
              type="button"
              className={`menu-item has-badge ${currentTab === 'all-inboxes' ||
                tags.some((t) => t.id === currentTab)
                ? 'parent-active'
                : ''
                }`}
              onClick={() => {
                setInboxExpanded(!inboxExpanded);
                handleTabClick('all-inboxes');
              }}
              title="All Tags"
            >
              <Inbox size={18} className="item-icon inbox-icon" />
              {!isCollapsed && (
                <>
                  <span className="item-label inbox-label">All Tags</span>
                  <button
                    type="button"
                    className="btn-add-tag-quick"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInboxExpanded(true);
                      setIsAddingTag(true);
                    }}
                    title="Add new tag"
                    aria-label="Add new tag"
                  >
                    <Plus size={14} />
                  </button>
                </>
              )}
            </button>

            {/* Nested Sub-items */}
            {!isCollapsed && inboxExpanded && (
              <div className="sub-menu-tree">
                {tags.map((sub) => {
                  const isSubActive = currentTab === sub.id;
                  const isEditingThisTag = editingTagId === sub.id;

                  if (isEditingThisTag) {
                    return (
                      <div
                        key={sub.id}
                        className="add-tag-inline-form rename-tag-form"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          className="colored-dot"
                          style={{ backgroundColor: sub.dotColor }}
                        />
                        <input
                          type="text"
                          className="add-tag-input"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(sub.id);
                            if (e.key === 'Escape') handleCancelRename();
                          }}
                          autoFocus
                        />
                        <button
                          type="button"
                          className="btn-tag-action confirm"
                          onClick={() => handleSaveRename(sub.id)}
                          title="Save"
                          aria-label="Save rename"
                        >
                          <Check size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn-tag-action cancel"
                          onClick={handleCancelRename}
                          title="Cancel"
                          aria-label="Cancel rename"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={sub.id}
                      role="button"
                      tabIndex={0}
                      className={`sub-menu-item ${isSubActive ? 'sub-active' : ''}`}
                      onClick={() => handleTabClick(sub.id)}
                      onDoubleClick={(e) => handleStartRename(e, sub)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleTabClick(sub.id);
                        }
                      }}
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
                      <div className="tag-actions-group">
                        <button
                          type="button"
                          className="btn-edit-tag"
                          title="Rename tag"
                          aria-label="Rename tag"
                          onClick={(e) => handleStartRename(e, sub)}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn-del-tag"
                          title="Delete tag"
                          aria-label="Delete tag"
                          onClick={(e) => handleDeleteTag(e, sub.id)}
                          onMouseEnter={() => setHoveredDeleteTagId(sub.id)}
                          onMouseLeave={() => setHoveredDeleteTagId(null)}
                        >
                          {hoveredDeleteTagId === sub.id ? (
                            <Trash2 size={14} />
                          ) : (
                            <Trash size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add new tag button / inline form */}
                {isAddingTag ? (
                  <div className="add-tag-inline-form">
                    <span
                      className="colored-dot"
                      style={{ backgroundColor: '#10b981' }}
                    />
                    <input
                      type="text"
                      className="add-tag-input"
                      placeholder="New tag..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateTag();
                        if (e.key === 'Escape') {
                          setIsAddingTag(false);
                          setNewTagName('');
                        }
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn-tag-action confirm"
                      onClick={handleCreateTag}
                      title="Confirm"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn-tag-action cancel"
                      onClick={() => {
                        setIsAddingTag(false);
                        setNewTagName('');
                      }}
                      title="Cancel"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-add-new-tag"
                    onClick={() => setIsAddingTag(true)}
                  >
                    <Plus size={14} className="add-tag-icon" />
                    <span>Add new tag</span>
                  </button>
                )}
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
