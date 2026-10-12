import { useState, useMemo, useCallback } from 'react';
import type { NoteItem } from '../types/note';
import type { TagItem } from '../types/tag';
import { INITIAL_NOTES } from '../data/mockNotes';
import { INITIAL_TAGS, TAG_COLOR_PALETTE } from '../constants/tags';

export function useNotes() {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [activeCategory, setActiveCategory] = useState<string>('Projects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  // Helper to ensure a tag exists in the tags collection
  const ensureTagExists = useCallback((tagLabel: string) => {
    const trimmed = tagLabel.trim();
    if (
      !trimmed ||
      trimmed.toLowerCase() === 'all' ||
      trimmed.toLowerCase() === 'add tag'
    ) {
      return;
    }

    setTags((prev) => {
      const exists = prev.some(
        (t) => t.label.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return prev;

      const randomColor =
        TAG_COLOR_PALETTE[prev.length % TAG_COLOR_PALETTE.length];
      const newTagId = trimmed.toLowerCase().replace(/\s+/g, '-');

      return [
        ...prev,
        {
          id: newTagId,
          label: trimmed,
          dotColor: randomColor
        }
      ];
    });
  }, []);

  // Compute category tabs dynamically: 'All' + unique tag labels from tags & notes
  const categoryTabs = useMemo(() => {
    const tabLabels = ['All'];
    tags.forEach((t) => {
      if (!tabLabels.some((l) => l.toLowerCase() === t.label.toLowerCase())) {
        tabLabels.push(t.label);
      }
    });

    // Also include any unique tags present in existing notes that might not be in tags list
    notes.forEach((n) => {
      const noteTag = n.tag?.trim();
      if (
        noteTag &&
        noteTag.toLowerCase() !== 'all' &&
        noteTag.toLowerCase() !== 'add tag' &&
        !tabLabels.some((l) => l.toLowerCase() === noteTag.toLowerCase())
      ) {
        tabLabels.push(noteTag);
      }
    });

    return tabLabels;
  }, [tags, notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Filter by active category tab
      if (activeCategory !== 'All') {
        const noteTagLower = (note.tag || '').toLowerCase();
        const activeCatLower = activeCategory.toLowerCase();

        const isDirectMatch = noteTagLower === activeCatLower;
        const isPersonalMatch =
          activeCatLower === 'personal' &&
          (noteTagLower === 'personal' || note.tagType === 'personal');
        const isProjectsMatch =
          activeCatLower === 'projects' &&
          (noteTagLower === 'projects' ||
            (note.tagType === 'projects' && noteTagLower !== 'business'));
        const isBusinessMatch =
          activeCatLower === 'business' && noteTagLower === 'business';

        const matchesCategory =
          isDirectMatch || isPersonalMatch || isProjectsMatch || isBusinessMatch;

        if (!matchesCategory) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        const matchesTag = (note.tag || '').toLowerCase().includes(query);
        return matchesTitle || matchesContent || matchesTag;
      }

      return true;
    });
  }, [notes, activeCategory, searchQuery]);

  const handleUpdateNote = useCallback((updatedNote: NoteItem) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
    setSelectedNote(updatedNote);
    if (updatedNote.tag) {
      ensureTagExists(updatedNote.tag);
    }
  }, [ensureTagExists]);

  const handleAddNote = useCallback((newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
    if (newNote.tag) {
      ensureTagExists(newNote.tag);
    }
  }, [ensureTagExists]);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setSelectedNote((prevSelected) => (prevSelected?.id === id ? null : prevSelected));
  }, []);

  const handleAddTag = useCallback((newTagOrName: TagItem | string) => {
    if (typeof newTagOrName === 'string') {
      const trimmed = newTagOrName.trim();
      if (!trimmed) return;
      ensureTagExists(trimmed);
      setActiveCategory(trimmed);
    } else {
      setTags((prev) => {
        if (
          prev.some(
            (t) =>
              t.id === newTagOrName.id ||
              t.label.toLowerCase() === newTagOrName.label.toLowerCase()
          )
        ) {
          return prev;
        }
        return [...prev, newTagOrName];
      });
      setActiveCategory(newTagOrName.label);
    }
  }, [ensureTagExists]);

  const handleDeleteTag = useCallback((tagId: string) => {
    setTags((prev) => {
      const tagToDelete = prev.find((t) => t.id === tagId);
      if (
        tagToDelete &&
        activeCategory.toLowerCase() === tagToDelete.label.toLowerCase()
      ) {
        setActiveCategory('All');
      }
      return prev.filter((t) => t.id !== tagId);
    });
  }, [activeCategory]);

  const handleRenameTag = useCallback((tagId: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setTags((prev) =>
      prev.map((t) => (t.id === tagId ? { ...t, label: trimmed } : t))
    );

    setNotes((prev) =>
      prev.map((n) =>
        n.tag.toLowerCase() === tagId.toLowerCase()
          ? { ...n, tag: trimmed }
          : n
      )
    );

    setActiveCategory((prevActive) =>
      prevActive.toLowerCase() === tagId.toLowerCase() ? trimmed : prevActive
    );
  }, []);

  const handleAddTagClick = useCallback((note: NoteItem) => {
    const customTag = prompt('Nhập tag mới cho ghi chú này:', 'Idea');
    if (customTag && customTag.trim()) {
      const trimmedTag = customTag.trim();
      setNotes((prev) =>
        prev.map((n) =>
          n.id === note.id
            ? { ...n, tag: trimmedTag, tagType: 'custom' }
            : n
        )
      );
      ensureTagExists(trimmedTag);
      setActiveCategory(trimmedTag);
    }
  }, [ensureTagExists]);

  return {
    notes,
    tags,
    categoryTabs,
    filteredNotes,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedNote,
    setSelectedNote,
    handleUpdateNote,
    handleAddNote,
    handleDeleteNote,
    handleAddTag,
    handleDeleteTag,
    handleRenameTag,
    handleAddTagClick
  };
}
