import React from 'react';
import { Pencil, Trash, Trash2 } from 'lucide-react';
import type { TagItem } from '../../../types/tag';

interface SidebarTagItemProps {
  tag: TagItem;
  isActive: boolean;
  isHoveredDelete: boolean;
  onSelect: () => void;
  onStartRename: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onMouseEnterDelete: () => void;
  onMouseLeaveDelete: () => void;
}

export const SidebarTagItem: React.FC<SidebarTagItemProps> = ({
  tag,
  isActive,
  isHoveredDelete,
  onSelect,
  onStartRename,
  onDelete,
  onMouseEnterDelete,
  onMouseLeaveDelete
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`sub-menu-item ${isActive ? 'sub-active' : ''}`}
      onClick={onSelect}
      onDoubleClick={onStartRename}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
        }
      }}
    >
      {isActive && <span className="active-indicator-bar" />}
      <span
        className="colored-dot"
        style={{ backgroundColor: tag.dotColor }}
      />
      <span className="sub-item-label">{tag.label}</span>
      {tag.badge && (
        <span className="badge-pill sub-badge">{tag.badge}</span>
      )}

      <div className="tag-actions-group">
        <button
          type="button"
          className="btn-edit-tag"
          title="Rename tag"
          aria-label="Rename tag"
          onClick={onStartRename}
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          className="btn-del-tag"
          title="Delete tag"
          aria-label="Delete tag"
          onClick={onDelete}
          onMouseEnter={onMouseEnterDelete}
          onMouseLeave={onMouseLeaveDelete}
        >
          {isHoveredDelete ? <Trash2 size={14} /> : <Trash size={14} />}
        </button>
      </div>
    </div>
  );
};
