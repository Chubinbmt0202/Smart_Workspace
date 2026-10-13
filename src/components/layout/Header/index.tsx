import React, { useRef, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import type { NotificationItem, NoteItem } from '../../../types/note';
import { NotificationPopover } from './NotificationPopover';

export interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: NotificationItem[];
  isNotificationsOpen: boolean;
  onToggleNotifications: () => void;
  onCloseNotifications: () => void;
  userName?: string;
  userAvatar?: string;
  todayNotes?: NoteItem[];
  todayNotesCount?: number;
  onSelectNote?: (note: NoteItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  notifications,
  isNotificationsOpen,
  onToggleNotifications,
  onCloseNotifications,
  userName,
  userAvatar,
  todayNotes = [],
  todayNotesCount = 0,
  onSelectNote
}) => {
  const notificationWrapperRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside the notification wrapper
  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationWrapperRef.current &&
        !notificationWrapperRef.current.contains(event.target as Node)
      ) {
        onCloseNotifications();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen, onCloseNotifications]);

  return (
    <header className="top-header">
      {/* Search Input */}
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-input"
        />
      </div>

      {/* Header Right Profile & Notification Controls */}
      <div className="header-right">
        {/* Notification Bell with Badge and Popover */}
        <div className="notification-wrapper" ref={notificationWrapperRef}>
          <button
            className={`btn-notification ${isNotificationsOpen ? 'active' : ''}`}
            onClick={onToggleNotifications}
            id="notification-bell-button"
            aria-label="Toggle notifications"
            type="button"
          >
            <Bell size={18} />
            {todayNotesCount > 0 && (
              <span className="notification-badge" id="notification-badge">
                {todayNotesCount}
              </span>
            )}
          </button>

          {/* Popover component */}
          {isNotificationsOpen && (
            <NotificationPopover
              notifications={notifications}
              todayNotes={todayNotes}
              todayNotesCount={todayNotesCount}
              onClose={onCloseNotifications}
              onSelectNote={onSelectNote}
            />
          )}
        </div>

        {/* User profile */}
        {userName && userAvatar && (
          <div className="user-profile">
            <span className="user-name">{userName}</span>
            <img src={userAvatar} alt={userName} className="user-avatar" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
