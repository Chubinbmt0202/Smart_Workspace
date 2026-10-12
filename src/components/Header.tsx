import React, { useRef, useEffect } from 'react';
import { Search, Bell, SlidersHorizontal } from 'lucide-react';
import type { NotificationItem } from '../types/note';
import { NotificationPopover } from './NotificationPopover';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: NotificationItem[];
  isNotificationsOpen: boolean;
  onToggleNotifications: () => void;
  onCloseNotifications: () => void;
  userName: string;
  userAvatar: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  notifications,
  isNotificationsOpen,
  onToggleNotifications,
  onCloseNotifications,
  userName,
  userAvatar
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // do not auto close if user just interacted
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCloseNotifications]);

  const unreadCount = notifications.length;

  return (
    <header className="top-header" ref={containerRef}>
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

      {/* Header Actions */}
      <div className="header-actions">
        {/* Bell Button */}
        <button
          className="bell-btn"
          onClick={onToggleNotifications}
          aria-label="Toggle notifications"
          title="Notifications"
          id="bell-button"
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
        </button>

        {/* User Info */}
        <div className="user-profile">
          <span className="user-name">{userName}</span>
          <img
            src={userAvatar}
            alt={userName}
            className="user-avatar-img"
          />
        </div>

        {/* Top Sliders / Settings Icon */}
        <button
          className="header-filter-btn"
          aria-label="Filter settings"
          title="Filter settings"
        >
          <SlidersHorizontal size={18} />
        </button>

        {/* Notification Popover Dropdown */}
        {isNotificationsOpen && (
          <NotificationPopover
            notifications={notifications}
            onClose={onCloseNotifications}
          />
        )}
      </div>
    </header>
  );
};
