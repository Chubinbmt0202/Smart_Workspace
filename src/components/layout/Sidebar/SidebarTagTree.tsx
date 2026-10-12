import React from 'react';
import { Plus, Check, X } from 'lucide-react';
import type { TagItem } from '../../../types/tag';
import { SidebarTagItem } from './SidebarTagItem';

interface SidebarTagTreeProps {
  tags: TagItem[];
  currentTab?: string;
  isAddingTag: boolean;
  newTagName: string;
  editingTagId: string | null;
  editingTagName: string;
  hoveredDeleteTagId: string | null;
  onSelectTag: (tagId: string) => void;
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

export const SidebarTagTree: React.FC<SidebarTagTreeProps> = ({
  tags,
  currentTab,
  isAddingTag,
  newTagName,
  editingTagId,
  editingTagName,
  hoveredDeleteTagId,
  onSelectTag,
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
                onChange={(e) => onChangeEditingTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onConfirmRenameTag(sub.id);
                  if (e.key === 'Escape') onCancelRenameTag();
                }}
                autoFocus
              />
              <button
                type="button"
                className="btn-tag-action confirm"
                onClick={() => onConfirmRenameTag(sub.id)}
                title="Save"
                aria-label="Save rename"
              >
                <Check size={13} />
              </button>
              <button
                type="button"
                className="btn-tag-action cancel"
                onClick={onCancelRenameTag}
                title="Cancel"
                aria-label="Cancel rename"
              >
                <X size={13} />
              </button>
            </div>
          );
        }

        return (
          <SidebarTagItem
            key={sub.id}
            tag={sub}
            isActive={isSubActive}
            isHoveredDelete={hoveredDeleteTagId === sub.id}
            onSelect={() => onSelectTag(sub.id)}
            onStartRename={(e) => onStartRenameTag(e, sub)}
            onDelete={(e) => onDeleteTag(e, sub.id)}
            onMouseEnterDelete={() => onMouseEnterDelete(sub.id)}
            onMouseLeaveDelete={onMouseLeaveDelete}
          />
        );
      })}

    </div>
  );
};
