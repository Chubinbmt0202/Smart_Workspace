import { useState } from 'react';
import type { TagItem } from '../types/tag';
import { INITIAL_TAGS, TAG_COLOR_PALETTE } from '../constants/tags';

interface UseSidebarTagsOptions {
  tags?: TagItem[];
  onAddTag?: (tag: TagItem) => void;
  onDeleteTag?: (tagId: string) => void;
  renameTag?: (tagId: string, newName: string) => void;
  currentTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export function useSidebarTags(options: UseSidebarTagsOptions = {}) {
  const {
    tags: propTags,
    onAddTag,
    onDeleteTag,
    renameTag,
    currentTab,
    onSelectTab
  } = options;

  const [internalTags, setInternalTags] = useState<TagItem[]>(INITIAL_TAGS);
  const tags = propTags ?? internalTags;

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [hoveredDeleteTagId, setHoveredDeleteTagId] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const handleCreateTag = () => {
    const trimmed = newTagName.trim();
    if (!trimmed) {
      setIsAddingTag(false);
      return;
    }

    const randomColor =
      TAG_COLOR_PALETTE[tags.length % TAG_COLOR_PALETTE.length];
    const newTagId = trimmed.toLowerCase().replace(/\s+/g, '-');

    const newTag: TagItem = {
      id: newTagId,
      label: trimmed,
      dotColor: randomColor
    };

    if (propTags && onAddTag) {
      onAddTag(newTag);
    } else {
      setInternalTags((prev) => [...prev, newTag]);
      onAddTag?.(newTag);
    }

    setNewTagName('');
    setIsAddingTag(false);
    onSelectTab?.(newTagId);
  };

  const handleDeleteTag = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    if (propTags && onDeleteTag) {
      onDeleteTag(tagId);
    } else {
      setInternalTags((prev) => prev.filter((t) => t.id !== tagId));
      onDeleteTag?.(tagId);
    }
    if (currentTab === tagId) {
      onSelectTab?.('all-inboxes');
    }
  };

  const handleStartRename = (e: React.MouseEvent, tag: TagItem) => {
    e.stopPropagation();
    setEditingTagId(tag.id);
    setEditingTagName(tag.label);
  };

  const handleSaveRename = (tagId: string) => {
    const trimmed = editingTagName.trim();
    if (trimmed) {
      if (propTags && renameTag) {
        renameTag(tagId, trimmed);
      } else {
        setInternalTags((prev) =>
          prev.map((t) => (t.id === tagId ? { ...t, label: trimmed } : t))
        );
        renameTag?.(tagId, trimmed);
      }
    }
    setEditingTagId(null);
    setEditingTagName('');
  };

  const handleCancelRename = () => {
    setEditingTagId(null);
    setEditingTagName('');
  };

  return {
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
  };
}
