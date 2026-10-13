import { useState, useMemo } from 'react';
import {
  Sidebar,
  Header,
  CategoryTabs,
  NoteCard,
  AddNoteModal,
  EmptyState,
  NoteDetailDrawer,
  CalendarView,
  RecycleBinView
} from '../components';
import { useNotes } from '../hooks/useNotes';
import { INITIAL_NOTIFICATIONS, USER_PROFILE } from '../data/mockNotes';
import { isNoteToday } from '../utils/date';
import type { NotificationItem } from '../types';

export function Home() {
  const [sidebarTab, setSidebarTab] = useState<string>('projects');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [modalInitialDate, setModalInitialDate] = useState<
    { day: number; month: number; year: number } | undefined
  >(undefined);
  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const {
    notes,
    tags,
    categoryTabs,
    filteredNotes,
    deletedNotes,
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
  } = useNotes();

  const todayNotes = useMemo(() => notes.filter(isNoteToday), [notes]);
  const todayNotesCount = todayNotes.length;

  const handleSelectSidebarTab = (tab: string) => {
    setSidebarTab(tab);

    if (tab === 'recycle') {
      return;
    }

    if (tab === 'calendar' || tab === 'scheduled') {
      setViewMode('calendar');
      return;
    }

    setViewMode('grid');

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

  const handleOpenAddModalWithDate = (date: {
    day: number;
    month: number;
    year: number;
  }) => {
    setModalInitialDate(date);
    setIsAddModalOpen(true);
  };

  return (
    <div className="app-frame">
      {/* Sidebar */}
      <Sidebar
        currentTab={sidebarTab}
        onSelectTab={handleSelectSidebarTab}
        onOpenAddModal={() => {
          setModalInitialDate(undefined);
          setIsAddModalOpen(true);
        }}
        onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
        renameTag={handleRenameTag}
        deletedCount={deletedNotes.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Fixed Top Section: Header & Category Tabs */}
        <div className="main-top-section">
          {/* Header */}
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            notifications={notifications}
            todayNotes={todayNotes}
            todayNotesCount={todayNotesCount}
            isNotificationsOpen={isNotificationsOpen}
            onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
            onCloseNotifications={() => setIsNotificationsOpen(false)}
            userName={USER_PROFILE.name}
            userAvatar={USER_PROFILE.avatarUrl}
            onSelectNote={setSelectedNote}
          />

          {/* Category Tabs (shown when not in recycle bin) */}
          {sidebarTab !== 'recycle' && (
            <CategoryTabs
              activeTab={activeCategory}
              onSelectTab={handleSelectCategoryTab}
              tabs={categoryTabs}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
            />
          )}
        </div>

        {/* Scrollable Content Body: Notes Grid / Calendar / Recycle Bin */}
        <div className="main-scroll-body">
          {sidebarTab === 'recycle' ? (
            <RecycleBinView
              deletedNotes={deletedNotes}
              onRestoreNote={handleRestoreNote}
              onPermanentDeleteNote={handlePermanentDeleteNote}
              onEmptyRecycleBin={handleEmptyRecycleBin}
              onSelectNote={setSelectedNote}
            />
          ) : viewMode === 'calendar' ? (
            <CalendarView
              notes={filteredNotes}
              onSelectNote={setSelectedNote}
              onOpenAddModalWithDate={handleOpenAddModalWithDate}
              onSwitchToGrid={() => setViewMode('grid')}
            />
          ) : filteredNotes.length > 0 ? (
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
              onOpenAddModal={() => {
                setModalInitialDate(undefined);
                setIsAddModalOpen(true);
              }}
              onClearSearch={() => setSearchQuery('')}
            />
          )}
        </div>
      </main>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setModalInitialDate(undefined);
        }}
        onAddNote={handleAddNote}
        defaultCategory={activeCategory}
        availableTags={tags}
        onAddNewTag={handleAddTag}
        initialDate={modalInitialDate}
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