import React from 'react';
import { Home, Inbox, Clock, Trash2, Plus } from 'lucide-react';
import type { TagItem } from '../../../types/tag';
import { SidebarTagTree } from './SidebarTagTree';

interface SidebarNavProps {
  isCollapsed: boolean;
  currentTab?: string;
  inboxExpanded: boolean;
  tags: TagItem[];
  isAddingTag: boolean;
  newTagName: string;
  editingTagId: string | null;
  editingTagName: string;
  hoveredDeleteTagId: string | null;
  onSelectTab: (tabId: string) => void;
  onToggleInbox: () => void;
  onStartAddTag: () => void;
  onCancelAddTag: () => void;
  onChangeNewTagName: (name: string) => void;
  onConfirmAddTag: () => void;
  onStartRenameTag: (e: React.MouseEvent, tag: TagItem) => void;
  onChangeEditingTagName: (name: string) => void;
  onConfirmRenameTag: (tagId: string) => void;
  onCancelRenameTag: () => void;
  onDeleteTag: (e: React.MouseEvent, tagId: string) => void;
  onMouseEnterDelete: (tagId: string) => void;
  onMouseLeaveDelete: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isCollapsed,
  currentTab,
  inboxExpanded,
  tags,
  isAddingTag,
  newTagName,
  editingTagId,
  editingTagName,
  hoveredDeleteTagId,
  onSelectTab,
  onToggleInbox,
  onStartAddTag,
  onCancelAddTag,
  onChangeNewTagName,
  onConfirmAddTag,
  onStartRenameTag,
  onChangeEditingTagName,
  onConfirmRenameTag,
  onCancelRenameTag,
  onDeleteTag,
  onMouseEnterDelete,
  onMouseLeaveDelete
}) => {
  return (
    <div className="sidebar-scrollable-content">
      <div className="sidebar-menu-group">
        {!isCollapsed && <div className="group-title">MAIN MENU</div>}

        {/* Home */}
        <button
          type="button"
          className={`menu-item ${currentTab === 'account' ? 'active' : ''}`}
          onClick={() => onSelectTab('account')}
          title="Home"
        >
          <Home size={18} className="item-icon" />
          {!isCollapsed && <span className="item-label">Home</span>}
        </button>

        {/* All Tags Container */}
        <div className="inbox-parent-container">
          <button
            type="button"
            className={`menu-item has-badge ${
              currentTab === 'all-inboxes' || tags.some((t) => t.id === currentTab)
                ? 'parent-active'
                : ''
            }`}
            onClick={onToggleInbox}
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
                    onStartAddTag();
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
            <SidebarTagTree
              tags={tags}
              currentTab={currentTab}
              isAddingTag={isAddingTag}
              newTagName={newTagName}
              editingTagId={editingTagId}
              editingTagName={editingTagName}
              hoveredDeleteTagId={hoveredDeleteTagId}
              onSelectTag={onSelectTab}
              onStartAddTag={onStartAddTag}
              onCancelAddTag={onCancelAddTag}
              onChangeNewTagName={onChangeNewTagName}
              onConfirmAddTag={onConfirmAddTag}
              onStartRenameTag={onStartRenameTag}
              onChangeEditingTagName={onChangeEditingTagName}
              onConfirmRenameTag={onConfirmRenameTag}
              onCancelRenameTag={onCancelRenameTag}
              onDeleteTag={onDeleteTag}
              onMouseEnterDelete={onMouseEnterDelete}
              onMouseLeaveDelete={onMouseLeaveDelete}
            />
          )}
        </div>

        {/* Scheduled */}
        <button
          type="button"
          className={`menu-item ${currentTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => onSelectTab('scheduled')}
          title="Scheduled"
        >
          <Clock size={18} className="item-icon" />
          {!isCollapsed && <span className="item-label">Scheduled</span>}
        </button>

        {/* Recycle Bin */}
        <button
          type="button"
          className={`menu-item ${currentTab === 'recycle' ? 'active' : ''}`}
          onClick={() => onSelectTab('recycle')}
          title="Recycle"
        >
          <Trash2 size={18} className="item-icon" />
          {!isCollapsed && <span className="item-label">Recycle bin</span>}
        </button>
      </div>
    </div>
  );
};
