import { useState } from 'react';
import {
  Sidebar,
  Header,
  CategoryTabs,
  NoteCard,
  AddNoteModal,
  EmptyState,
  NoteDetailDrawer
} from '../components';
import { useNotes } from '../hooks/useNotes';
import { INITIAL_NOTIFICATIONS, USER_PROFILE } from '../data/mockNotes';
import type { NotificationItem } from '../types';

export function Home() {
  const [sidebarTab, setSidebarTab] = useState<string>('projects');
  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const {
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
  } = useNotes();

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
        renameTag={handleRenameTag}
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

        {/* Notes Grid or Empty State */}
        {filteredNotes.length > 0 ? (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={setSelectedNote}
                onDeleteNote={handleDeleteNote}
                onAddTagClick={handleAddTagClick}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            category={activeCategory}
            searchQuery={searchQuery}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onClearSearch={() => setSearchQuery('')}
          />
        )}
      </main>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNote={handleAddNote}
        defaultCategory={activeCategory}
      />

      {/* Note Detail Drawer */}
      <NoteDetailDrawer
        isOpen={Boolean(selectedNote)}
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default Home;