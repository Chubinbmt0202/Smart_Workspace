import React from 'react';
import { Bell, Calendar } from 'lucide-react';
import type { NotificationItem, NoteItem } from '../../../types/note';
import type { TagItem } from '../../../types/tag';
import { getTagColor, getTagColorClass } from '../../../utils/tagColor';

export interface NotificationPopoverProps {
  notifications?: NotificationItem[];
  todayNotes?: NoteItem[];
  todayNotesCount?: number;
  onClose?: () => void;
  onClearNotification?: (id: string) => void;
  onSelectNote?: (note: NoteItem) => void;
  tags?: TagItem[];
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  notifications = [],
  todayNotes = [],
  todayNotesCount,
  onClose,
  onClearNotification,
  onSelectNote,
  tags = []
}) => {
  const normalNotifications = notifications.filter((n) => !n.isOverdue);
  const overdueNotifications = notifications.filter((n) => n.isOverdue);
  const totalTodayCount = todayNotesCount !== undefined ? todayNotesCount : todayNotes.length;

  return (
    <div className="notification-popover" id="notification-popover">
      {/* Popover Header with Today's Note Count */}
      <div className="notif-header">
        <div className="notif-header-title">
          <Bell size={16} className="notif-header-icon" />
          <span>Thông báo</span>
        </div>
        <span className="notif-today-badge">
          {totalTodayCount} note hôm nay
        </span>
      </div>

      <div className="notification-scroll-container">
        {/* Today's Notes Section */}
        {todayNotes.length > 0 && (
          <div className="notif-section">
            <div className="notif-section-title">
              <Calendar size={12} />
              <span>Ghi chú hôm nay ({todayNotes.length})</span>
            </div>
            <div className="notification-list">
              {todayNotes.map((note) => {
                return (
                  <div
                    key={note.id}
                    className="notification-item note-today-item"
                    onClick={() => {
                      onSelectNote?.(note);
                      onClose?.();
                    }}
                    title="Bấm để xem chi tiết ghi chú"
                  >
                    <div
                      className={`notif-dot ${getTagColorClass(note.tag)}`}
                      style={{ backgroundColor: getTagColor(note.tag, tags) }}
                    />
                    <div className="notif-content">
                      <div className="notif-top-row">
                        <span className="notif-title">{note.title}</span>
                        <span className="notif-date">
                          {note.reminder?.time ? note.reminder.time : note.date}
                        </span>
                      </div>
                      <p className="notif-subtitle">{note.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Notifications */}
        {normalNotifications.length > 0 && todayNotes.length === 0 && (
          <div className="notification-list">
            {normalNotifications.map((item) => (
              <div
                key={item.id}
                className="notification-item"
                onClick={() => onClearNotification && onClearNotification(item.id)}
              >
                <div
                  className="notif-dot"
                  style={{ backgroundColor: item.dotColor }}
                />
                <div className="notif-content">
                  <div className="notif-top-row">
                    <span className="notif-title">{item.title}</span>
                    <span className="notif-date">{item.date}</span>
                  </div>
                  <p className="notif-subtitle">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overdue Section */}
        {overdueNotifications.length > 0 && (
          <div className="notif-section">
            <div className="notif-section-title notif-overdue-title">
              <span>Bỏ lỡ</span>
            </div>
            <div className="notification-list">
              {overdueNotifications.map((item) => (
                <div
                  key={item.id}
                  className="notification-item"
                  onClick={() => onClearNotification && onClearNotification(item.id)}
                >
                  <div
                    className="notif-dot"
                    style={{ backgroundColor: item.dotColor }}
                  />
                  <div className="notif-content">
                    <div className="notif-top-row">
                      <span className="notif-title">{item.title}</span>
                      <span className="notif-date">{item.date}</span>
                    </div>
                    <p className="notif-subtitle">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when there are no notes today and no notifications */}
        {todayNotes.length === 0 &&
          normalNotifications.length === 0 &&
          overdueNotifications.length === 0 && (
            <div className="notif-empty">
              <p>Không có ghi chú nào hôm nay</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default NotificationPopover;
