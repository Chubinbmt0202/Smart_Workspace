import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Pin,
  Clock,
  Paperclip,
  Calendar,
  Plus,
  Check,
  Tag
} from 'lucide-react';
import type { NoteItem } from '../../types/note';

export interface NoteDetailDrawerProps {
  note: NoteItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const NoteDetailDrawer: React.FC<NoteDetailDrawerProps> = ({
  note,
  isOpen,
  onClose,
  onUpdateNote,
  onDeleteNote
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [reminderDay, setReminderDay] = useState('Today');
  const [reminderTime, setReminderTime] = useState('12.00');
  const [isPinned, setIsPinned] = useState(false);
  const [avatars, setAvatars] = useState<{ name: string; avatarUrl: string }[]>([]);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Sync state when note prop changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTag(note.tag);
      setIsUrgent(Boolean(note.reminder?.isUrgent));
      setReminderDay(note.reminder?.day || 'Today');
      setReminderTime(note.reminder?.time || '12.00');
      setAvatars(note.avatars || []);
      setIsPinned(false);
      setIsSavedRecently(false);
    }
  }, [note]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !note) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    const updatedNote: NoteItem = {
      ...note,
      title: title.trim(),
      content: content.trim(),
      tag,
      tagType:
        tag === 'Personal'
          ? 'personal'
          : tag === 'Projects'
          ? 'projects'
          : 'custom',
      avatars,
      reminder: {
        time: reminderTime,
        day: reminderDay,
        isUrgent
      }
    };

    onUpdateNote(updatedNote);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) {
      onDeleteNote(note.id);
      onClose();
    }
  };

  const handleAddCollaborator = () => {
    const name = prompt('Nhập tên người tham gia:', 'Alex');
    if (name && name.trim()) {
      const newAvatar = {
        name: name.trim(),
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + avatars.length * 100}?w=150&auto=format&fit=crop&q=80`
      };
      const nextAvatars = [...avatars, newAvatar];
      setAvatars(nextAvatars);
      onUpdateNote({ ...note, avatars: nextAvatars });
    }
  };

  const getTagBadgeStyle = () => {
    if (tag === 'Personal') return { backgroundColor: '#faa738', color: '#fff' };
    if (tag === 'Projects') return { backgroundColor: '#3e7bfa', color: '#fff' };
    if (tag === 'Business') return { backgroundColor: '#ef4444', color: '#fff' };
    return { backgroundColor: '#8b5cf6', color: '#fff' };
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer Panel */}
      <aside
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Chi tiết ghi chú"
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-tag-badge" style={getTagBadgeStyle()}>
              <Tag size={12} />
              <span>{tag}</span>
            </span>
          </div>

          <div className="drawer-header-actions">
            <button
              type="button"
              className={`drawer-icon-btn ${isPinned ? 'pinned' : ''}`}
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
              aria-label="Ghim ghi chú"
            >
              <Pin size={17} />
            </button>

            <button
              type="button"
              className="drawer-icon-btn delete"
              onClick={handleDelete}
              title="Xóa ghi chú"
              aria-label="Xóa ghi chú"
            >
              <Trash2 size={17} />
            </button>

            <button
              type="button"
              className="drawer-icon-btn"
              onClick={onClose}
              title="Đóng (Esc)"
              aria-label="Đóng"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Metadata chips */}
          <div className="drawer-meta-strip">
            <span className="meta-chip">
              <Calendar size={13} />
              <span>{note.date}</span>
            </span>

            {note.attachmentCount && note.attachmentCount > 0 ? (
              <span className="meta-chip">
                <Paperclip size={13} />
                <span>{note.attachmentCount} tệp đính kèm</span>
              </span>
            ) : null}

            {isUrgent && (
              <span className="meta-chip urgent">
                <span>Khẩn cấp (Urgent)</span>
              </span>
            )}
          </div>

          {/* Title input */}
          <input
            type="text"
            className="drawer-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề ghi chú..."
          />

          {/* Content textarea */}
          <textarea
            className="drawer-content-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung ghi chú ở đây..."
          />

          {/* Collaborators / Members */}
          <div className="drawer-section">
            <span className="drawer-section-title">Người tham gia</span>
            <div className="drawer-members-list">
              {avatars.map((av, index) => (
                <div key={index} className="drawer-member-pill">
                  <img
                    src={av.avatarUrl}
                    alt={av.name}
                    className="drawer-member-avatar"
                  />
                  <span className="drawer-member-name">{av.name}</span>
                </div>
              ))}

              <button
                type="button"
                className="btn-add-member"
                onClick={handleAddCollaborator}
              >
                <Plus size={13} />
                <span>Thêm người</span>
              </button>
            </div>
          </div>

          {/* Reminder Section */}
          <div className="drawer-section">
            <span className="drawer-section-title">Nhắc nhở</span>
            <div className="drawer-reminder-box">
              <div className="drawer-reminder-info">
                <Clock size={18} className="drawer-reminder-icon" />
                <div className="drawer-reminder-text">
                  <span className="drawer-reminder-time">{reminderTime}</span>
                  <span className="drawer-reminder-day">{reminderDay}</span>
                </div>
              </div>

              <label className="checkbox-label" style={{ fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <span>Bật khẩn cấp</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          {isSavedRecently && (
            <div className="drawer-save-status">
              <Check size={14} />
              <span>Đã lưu thành công!</span>
            </div>
          )}

          <div className="drawer-footer-actions">
            <button
              type="button"
              className="btn-drawer-cancel"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              type="button"
              className="btn-drawer-save"
              onClick={handleSave}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NoteDetailDrawer;
