import { useState } from 'react';
import type { TagItem } from '../types/tag';
import { INITIAL_TAGS, TAG_COLOR_PALETTE } from '../constants/tags';

interface UseSidebarTagsOptions {
  onAddTag?: (tag: TagItem) => void;
  onDeleteTag?: (tagId: string) => void;
  renameTag?: (tagId: string, newName: string) => void;
  currentTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export function useSidebarTags(options: UseSidebarTagsOptions = {}) {
  const { onAddTag, onDeleteTag, renameTag, currentTab, onSelectTab } = options;

  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
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

    const randomColor = TAG_COLOR_PALETTE[tags.length % TAG_COLOR_PALETTE.length];
    const newTagId = trimmed.toLowerCase().replace(/\s+/g, '-');

    const newTag: TagItem = {
      id: newTagId,
      label: trimmed,
      dotColor: randomColor
    };

    setTags((prev) => [...prev, newTag]);
    setNewTagName('');
    setIsAddingTag(false);
    onAddTag?.(newTag);
    onSelectTab?.(newTagId);
  };

  const handleDeleteTag = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    onDeleteTag?.(tagId);
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
