import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { NotificationItem } from '../types/note';

interface NotificationPopoverProps {
  notifications: NotificationItem[];
  onClose?: () => void;
  onClearNotification?: (id: string) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  notifications,
  onClearNotification
}) => {
  const normalNotifications = notifications.filter(n => !n.isOverdue);
  const overdueNotifications = notifications.filter(n => n.isOverdue);

  return (
    <div className="notification-popover" id="notification-popover">
      <div className="notification-list">
        {normalNotifications.map(item => (
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

        {overdueNotifications.length > 0 && (
          <>
            <div className="notif-section-title">You Forget!</div>
            {overdueNotifications.map(item => (
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
          </>
        )}
      </div>

      <div className="all-notifications-link" role="button">
        <span>All Notification</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
};
