import { useState, useMemo, useEffect } from 'react';
import {
  Sidebar,
  Header,
  CategoryTabs,
  NoteCard,
  AddNoteModal,
  EmptyState,
  NoteDetailDrawer,
  CalendarView,
  RecycleBinView,
  NotesGridSkeleton
} from '../components';
import { SuccessToast } from '../components/SuccessToast';
import { useNotes } from '../hooks/useNotes';
import { getNoteReminderStatus } from '../utils/date';
import type { NotificationItem } from '../types';

export function Home({ onLogout }: { onLogout: () => void }) {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [sidebarTab, setSidebarTab] = useState<string>('all-inboxes');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [modalInitialDate, setModalInitialDate] = useState<
    { day: number; month: number; year: number } | undefined
  >(undefined);
  const [notifications] = useState<NotificationItem[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState<boolean>(false);
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
    isLoading,
    isLoadingTrash,
    isMutating,
    toastNotifications,
    dismissSuccessNotification,
    handleUpdateNote,
    handleAddNote,
    handleDeleteNote,
    handleRestoreNote,
    handlePermanentDeleteNote,
    handleEmptyRecycleBin,
    handleAddTag,
    handleDeleteTag,
    handleRenameTag
  } = useNotes();

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTime(new Date()), 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const todayNotes = useMemo(
    () => notes.filter((note) => getNoteReminderStatus(note, currentTime) === 'today'),
    [notes, currentTime]
  );
  const overdueNotes = useMemo(
    () => notes.filter((note) => getNoteReminderStatus(note, currentTime) === 'overdue'),
    [notes, currentTime]
  );
  const todayNotesCount = todayNotes.length;

  const handleToggleNotifications = () => {
    setIsUserPopoverOpen(false);
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleToggleUserPopover = () => {
    setIsNotificationsOpen(false);
    setIsUserPopoverOpen((prev) => !prev);
  };

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
        onToggleNotifications={handleToggleNotifications}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
        renameTag={handleRenameTag}
        deletedCount={deletedNotes.length}
      />

      {/* Main Content Area */}
      <main className="main-content" style={{ position: 'relative' }}>
        {(isMutating || isLoading) && <div className="api-loading-bar" />}

        {/* Fixed Top Section: Header & Category Tabs */}
        <div className="main-top-section">
          {/* Header */}
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            notifications={notifications}
            todayNotes={todayNotes}
            overdueNotes={overdueNotes}
            todayNotesCount={todayNotesCount}
            onSelectNote={setSelectedNote}
            tags={tags}
            isNotificationsOpen={isNotificationsOpen}
            isUserPopoverOpen={isUserPopoverOpen}
            onToggleNotifications={handleToggleNotifications}
            onCloseNotifications={() => setIsNotificationsOpen(false)}
            onToggleUserPopover={handleToggleUserPopover}
            onCloseUserPopover={() => setIsUserPopoverOpen(false)}
            userName={localStorage.displayName}
            userAvatar={localStorage.photoURL}
            userEmail={localStorage.getItem('email') ?? undefined}
            onLogout={onLogout}
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
              isLoading={isLoadingTrash}
              onRestoreNote={handleRestoreNote}
              onPermanentDeleteNote={handlePermanentDeleteNote}
              onEmptyRecycleBin={handleEmptyRecycleBin}
              onSelectNote={setSelectedNote}
              tags={tags}
            />
          ) : viewMode === 'calendar' ? (
            <CalendarView
              notes={filteredNotes}
              onSelectNote={setSelectedNote}
              onOpenAddModalWithDate={handleOpenAddModalWithDate}
              onSwitchToGrid={() => setViewMode('grid')}
              tags={tags}
            />
          ) : isLoading ? (
            <NotesGridSkeleton count={6} />
          ) : filteredNotes.length > 0 ? (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={setSelectedNote}
                  onDeleteNote={handleDeleteNote}
                  tags={tags}
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

      {toastNotifications[0] && (
        <SuccessToast
          key={toastNotifications[0].id}
          message={toastNotifications[0].message}
          variant={toastNotifications[0].variant}
          onDismiss={dismissSuccessNotification}
        />
      )}
    </div>
  );
}

export default Home;