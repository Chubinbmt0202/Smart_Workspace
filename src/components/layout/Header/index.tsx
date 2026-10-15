import React, { useRef, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import type { NotificationItem, NoteItem } from "../../../types/note";
import type { TagItem } from "../../../types/tag";
import { NotificationPopover } from "./NotificationPopover";
import { UserPopover } from "./UserPopover";

export interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: NotificationItem[];
  isNotificationsOpen: boolean;
  isUserPopoverOpen: boolean;
  onToggleNotifications: () => void;
  onCloseNotifications: () => void;
  onToggleUserPopover: () => void;
  onCloseUserPopover: () => void;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  onLogout: () => void;
  todayNotes?: NoteItem[];
  todayNotesCount?: number;
  onSelectNote?: (note: NoteItem) => void;
  tags?: TagItem[];
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  notifications,
  isNotificationsOpen,
  isUserPopoverOpen,
  onToggleUserPopover,
  onCloseUserPopover,
  onToggleNotifications,
  onCloseNotifications,
  userName,
  userAvatar,
  userEmail,
  onLogout,
  todayNotes = [],
  todayNotesCount = 0,
  onSelectNote,
  tags = [],
}) => {
  const notificationWrapperRef = useRef<HTMLDivElement>(null);
  const userPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNotificationsOpen && !isUserPopoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isNotificationsOpen &&
        notificationWrapperRef.current &&
        !notificationWrapperRef.current.contains(event.target as Node)
      ) {
        onCloseNotifications();
      }

      if (
        isUserPopoverOpen &&
        userPopoverRef.current &&
        !userPopoverRef.current.contains(event.target as Node)
      ) {
        onCloseUserPopover();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isNotificationsOpen,
    isUserPopoverOpen,
    onCloseNotifications,
    onCloseUserPopover,
  ]);

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
            className={`btn-notification ${isNotificationsOpen ? "active" : ""}`}
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
              tags={tags}
            />
          )}
        </div>

        {/* User profile */}
        <div className="user-profile-wrapper" ref={userPopoverRef}>
          <button
            className={`btn-user-profile ${isUserPopoverOpen ? "active" : ""}`}
            onClick={onToggleUserPopover}
            id="user-profile-button"
            aria-label="Toggle user popover"
            aria-expanded={isUserPopoverOpen}
            aria-controls="user-popover"
            type="button"
          >
            <img
              src={userAvatar}
              alt={userName ? `${userName}'s avatar` : "User avatar"}
              className="user-avatar"
              id="user-avatar"
            />
          </button>
          {isUserPopoverOpen && (
            <UserPopover
              userName={userName}
              userAvatar={userAvatar}
              userEmail={userEmail}
              onLogout={onLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
