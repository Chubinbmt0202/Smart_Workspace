import { useState, useMemo } from 'react';
import type { NoteItem } from '../types/note';
import { INITIAL_NOTES } from '../data/mockNotes';

export function useNotes() {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [activeCategory, setActiveCategory] = useState<string>('Projects');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Filter by active category tab
      if (activeCategory !== 'All') {
        if (activeCategory === 'Personal' && note.tagType !== 'personal') {
          return false;
        }
        if (activeCategory === 'Projects' && note.tagType !== 'projects') {
          return false;
        }
        if (activeCategory === 'Business' && note.tag !== 'Business') {
          return false;
        }
        if (
          !['Personal', 'Projects', 'Business'].includes(activeCategory) &&
          note.tag.toLowerCase() !== activeCategory.toLowerCase()
        ) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        const matchesTag = note.tag.toLowerCase().includes(query);
        return matchesTitle || matchesContent || matchesTag;
      }

      return true;
    });
  }, [notes, activeCategory, searchQuery]);

  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  const handleUpdateNote = (updatedNote: NoteItem) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
    setSelectedNote(updatedNote);
  };

  const handleAddNote = (newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleRenameTag = (tagId: string, newName: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.tag.toLowerCase() === tagId.toLowerCase()
          ? { ...n, tag: newName }
          : n
      )
    );
    if (activeCategory.toLowerCase() === tagId.toLowerCase()) {
      setActiveCategory(newName);
    }
  };

  const handleAddTagClick = (note: NoteItem) => {
    const customTag = prompt('Enter new tag for this note:', 'Idea');
    if (customTag && customTag.trim()) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === note.id
            ? { ...n, tag: customTag.trim(), tagType: 'personal' }
            : n
        )
      );
    }
  };

  return {
    notes,
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
    handleRenameTag,
    handleAddTagClick
  };
}
