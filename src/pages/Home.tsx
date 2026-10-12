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
  } = useNotes();

  const handleSelectSidebarTab = (tab: string) => {
    setSidebarTab(tab);
    if (tab === 'all-inboxes') {
      setActiveCategory('All');
    } else {
      const matched = tags.find(
        (t) => t.id === tab || t.label.toLowerCase() === tab.toLowerCase()
      );
      if (matched) {
        setActiveCategory(matched.label);
      } else if (tab === 'projects') {
        setActiveCategory('Projects');
      } else if (tab === 'business') {
        setActiveCategory('Business');
      } else if (tab === 'primary' || tab === 'personal') {
        setActiveCategory('Personal');
      } else {
        setActiveCategory(tab);
      }
    }
  };

  const handleSelectCategoryTab = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setSidebarTab('all-inboxes');
    } else {
      const matched = tags.find(
        (t) =>
          t.label.toLowerCase() === category.toLowerCase() ||
          t.id === category.toLowerCase()
      );
      if (matched) {
        setSidebarTab(matched.id);
      }
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
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
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
          onSelectTab={handleSelectCategoryTab}
          tabs={categoryTabs}
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
        availableTags={tags}
        onAddNewTag={handleAddTag}
      />

      {/* Note Detail Drawer */}
      <NoteDetailDrawer
        isOpen={Boolean(selectedNote)}
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        availableTags={tags}
        onAddNewTag={handleAddTag}
      />
    </div>
  );
}

export default Home;