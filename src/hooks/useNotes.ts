import { useState, useMemo, useCallback, useEffect } from 'react';
import type { NoteItem } from '../types/note';
import type { TagItem } from '../types/tag';
import { INITIAL_NOTES, INITIAL_DELETED_NOTES } from '../data/mockNotes';
import { INITIAL_TAGS, TAG_COLOR_PALETTE } from '../constants/tags';
import { noteApi } from '../services/api';

export function useNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<NoteItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await noteApi.getAllNote();
        console.log('Dữ liệu API trả về:', res);
        const rawList = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
        // Chuẩn hóa dữ liệu từ Supabase: nếu tag là Object thì lấy tên/label ra chuỗi string
        const formattedNotes: NoteItem[] = rawList.map((item: any) => {
          let tagName = 'Chưa gắn tag';
          if (typeof item.tag === 'string' && item.tag.trim()) {
            tagName = item.tag.trim();
          } else if (item.tag && typeof item.tag === 'object') {
            tagName = item.tag.name || item.tag.label || item.tag.title || 'Chưa gắn tag';
          }

          return {
            ...item,
            tag: tagName,
            tagType: item.tagType || 'custom',
            date: item.date || (item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '')
          };
        });

        setNotes(formattedNotes);
      } catch (err) {
        console.error('Failed to load notes:', err);
      }
    }

    async function loadTags() {
      try {
        const res = await noteApi.getAllTags();
        console.log('Dữ liệu API trả về:', res);
        const rawList = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
        const formattedTags: TagItem[] = rawList.map((item: any) => {
          return {
            ...item,
            label: item.name || item.label || item.title || 'Chưa gắn tag',
            dotColor: item.dotColor
          };
        });
        setTags(formattedTags);
      } catch (err) {
        console.error('Failed to load tags:', err);
      }
    }

    loadNotes();
    loadTags();
  }, []);

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
      let rawTag = typeof n.tag === 'object' && n.tag !== null
        ? ((n.tag as any).name || (n.tag as any).label || '')
        : n.tag;
      let noteTag = typeof rawTag === 'string' ? rawTag.trim() : '';
      if (!noteTag) {
        noteTag = 'Chưa gắn tag';
      }
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
      const getTagString = (tag: any): string => {
        if (typeof tag === 'string') return tag;
        if (tag && typeof tag === 'object') return tag.name || tag.label || tag.title || '';
        return '';
      };
      const noteTagStr = getTagString(note.tag);

      // Filter by active category tab
      if (activeCategory !== 'All') {
        const noteTagLower = noteTagStr.toLowerCase();
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
        const matchesTitle = (note.title || '').toLowerCase().includes(query);
        const matchesContent = (note.content || '').toLowerCase().includes(query);
        const matchesTag = noteTagStr.toLowerCase().includes(query);
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
    setNotes((prevNotes) => {
      const targetNote = prevNotes.find((n) => n.id === id);
      if (targetNote) {
        const deletedNote: NoteItem = {
          ...targetNote,
          deletedAt: new Date().toISOString()
        };
        setDeletedNotes((prevDel) => [deletedNote, ...prevDel]);
      }
      return prevNotes.filter((note) => note.id !== id);
    });
    setSelectedNote((prevSelected) => (prevSelected?.id === id ? null : prevSelected));
  }, []);

  const handleRestoreNote = useCallback((id: string) => {
    setDeletedNotes((prevDel) => {
      const target = prevDel.find((n) => n.id === id);
      if (target) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { deletedAt: _, ...restoredNote } = target;
        setNotes((prevNotes) => [restoredNote, ...prevNotes]);
      }
      return prevDel.filter((n) => n.id !== id);
    });
  }, []);

  const handlePermanentDeleteNote = useCallback((id: string) => {
    setDeletedNotes((prevDel) => prevDel.filter((n) => n.id !== id));
  }, []);

  const handleEmptyRecycleBin = useCallback(() => {
    setDeletedNotes([]);
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
    deletedNotes,
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
    handleRestoreNote,
    handlePermanentDeleteNote,
    handleEmptyRecycleBin,
    handleAddTag,
    handleDeleteTag,
    handleRenameTag,
    handleAddTagClick
  };
}
