import React, { useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { CategoryTabs } from '../components/CategoryTabs';
import { NoteCard } from '../components/NoteCard';
import { AddNoteModal } from '../components/AddNoteModal';
import {
  INITIAL_NOTES,
  INITIAL_NOTIFICATIONS,
  USER_PROFILE
} from '../data/mockNotes';
import type { NoteItem, NotificationItem } from '../types/note';

export function Home() {
  const [sidebarTab, setSidebarTab] = useState<string>('projects');
  const [activeCategory, setActiveCategory] = useState<string>('Projects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  // Notification popover is open by default as shown in the screenshot
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const handleSelectSidebarTab = (tab: string) => {
    setSidebarTab(tab);
    if (tab === 'projects') {
      setActiveCategory('Projects');
    } else if (tab === 'business') {
      setActiveCategory('Business');
    } else if (tab === 'primary') {
      setActiveCategory('Personal');
    } else if (tab === 'all-inboxes') {
      setActiveCategory('All');
    } else {
      setActiveCategory(tab);
    }
  };

  // Filter notes by search and category
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

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleAddNote = (newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
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

  return (
    <div className="app-frame">
      {/* Sidebar */}
      <Sidebar
        currentTab={sidebarTab}
        onSelectTab={handleSelectSidebarTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          isNotificationsOpen={isNotificationsOpen}
          onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
          onCloseNotifications={() => setIsNotificationsOpen(false)}
          userName={USER_PROFILE.name}
          userAvatar={USER_PROFILE.avatarUrl}
        />

        {/* Category Tabs */}
        <CategoryTabs
          activeTab={activeCategory}
          onSelectTab={setActiveCategory}
        />

        {/* Notes Grid */}
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDeleteNote={handleDeleteNote}
              onAddTagClick={handleAddTagClick}
            />
          ))}
        </div>
      </main>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
export default Home;