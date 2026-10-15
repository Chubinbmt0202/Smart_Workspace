import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Paperclip, Clock, Trash2, Edit2, Pin } from 'lucide-react';
import type { NoteItem } from '../../types/note';
import type { TagItem } from '../../types/tag';
import { getTagColor, getTagColorClass } from '../../utils/tagColor';

export interface NoteCardProps {
  note: NoteItem;
  onDeleteNote: (id: string) => void;
  onAddTagClick?: (note: NoteItem) => void;
  onClick?: (note: NoteItem) => void;
  tags?: TagItem[];
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onDeleteNote,
  onAddTagClick,
  onClick,
  tags = []
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking inside menu dropdown or options button, ignore
    if (menuRef.current && menuRef.current.contains(e.target as Node)) {
      return;
    }
    onClick?.(note);
  };

  return (
    <article
      className="note-card"
      id={`note-${note.id}`}
      onClick={handleCardClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Top Row: Tag & More Options */}
      <div className="card-top-row">
        <span
          className={`card-tag ${getTagColorClass(note.tag)}`}
          onClick={(e) => {
            if (note.tagType === 'custom' && onAddTagClick) {
              e.stopPropagation();
              onAddTagClick(note);
            }
          }}
          style={{
            backgroundColor: getTagColor(note.tag, tags),
            cursor: note.tagType === 'custom' ? 'pointer' : 'default'
          }}
        >
          {note.tag}
        </span>

        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            className="card-options-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Note options"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="card-menu-dropdown">
              <button
                className="card-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
              >
                <Pin size={14} />
                <span>Pin Note</span>
              </button>
              <button
                className="card-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onClick?.(note);
                }}
              >
                <Edit2 size={14} />
                <span>View & Edit</span>
              </button>
              <button
                className="card-menu-item delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDeleteNote(note.id);
                }}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Date & Attachments */}
      <div className="card-meta-row">
        <span className="card-date">{note.date}</span>
        {note.attachmentCount && note.attachmentCount > 0 ? (
          <span className="card-attachments">
            <Paperclip size={14} />
            <span>{note.attachmentCount}</span>
          </span>
        ) : null}
      </div>

      {/* Title */}
      <h3 className="card-title" title={note.title}>
        {note.title}
      </h3>

      {/* Content snippet */}
      <p className="card-content" title={note.content}>
        {note.content}
      </p>

      {/* Bottom Footer Row: Reminder */}
      <div className="card-footer">
        {/* Reminder Time Tag */}
        {note.reminder && (
          <div
            className={`reminder-badge ${note.reminder.isUrgent ? 'urgent' : ''
              }`}
          >
            <Clock size={13} className="reminder-icon" />
            <span className="reminder-time">{note.reminder.time}</span>
            <span className="reminder-day">{note.reminder.day}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default NoteCard;
