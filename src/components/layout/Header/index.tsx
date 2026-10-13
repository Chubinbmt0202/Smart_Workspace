import React, { useRef, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import type { NotificationItem } from '../../../types/note';
import { NotificationPopover } from './NotificationPopover';

export interface HeaderProps {
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // preserve behavior
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

      {/* Header Right Profile & Notification Controls */}
      <div className="header-right">
        {/* Notification Bell with Badge and Popover */}
        <div className="notification-wrapper">
          <button
            className={`btn-notification ${isNotificationsOpen ? 'active' : ''}`}
            onClick={onToggleNotifications}
            id="notification-bell-button"
            aria-label="Toggle notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge" />}
          </button>

          {/* Inline popover component */}
          {isNotificationsOpen && (
            <NotificationPopover
              notifications={notifications}
              onClose={onCloseNotifications}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
