import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Paperclip, Clock, Trash2, Edit2, Pin } from 'lucide-react';
import type { NoteItem } from '../../types/note';

export interface NoteCardProps {
  note: NoteItem;
  onDeleteNote: (id: string) => void;
  onAddTagClick?: (note: NoteItem) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onDeleteNote,
  onAddTagClick
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

  const getTagClass = () => {
    if (note.tagType === 'personal') return 'tag-personal';
    if (note.tagType === 'projects') return 'tag-projects';
    return 'tag-custom';
  };

  return (
    <article className="note-card" id={`note-${note.id}`}>
      {/* Top Row: Tag & More Options */}
      <div className="card-top-row">
        <span
          className={`card-tag ${getTagClass()}`}
          onClick={() => {
            if (note.tagType === 'custom' && onAddTagClick) {
              onAddTagClick(note);
            }
          }}
          style={{ cursor: note.tagType === 'custom' ? 'pointer' : 'default' }}
        >
          {note.tag}
        </span>

        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            className="card-options-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Note options"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="card-menu-dropdown">
              <button
                className="card-menu-item"
                onClick={() => setMenuOpen(false)}
              >
                <Pin size={14} />
                <span>Pin Note</span>
              </button>
              <button
                className="card-menu-item"
                onClick={() => setMenuOpen(false)}
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
              <button
                className="card-menu-item delete"
                onClick={() => {
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
      <h3 className="card-title">{note.title}</h3>

      {/* Content snippet */}
      <p className="card-content">{note.content}</p>

      {/* Bottom Footer Row: Avatars & Reminder */}
      <div className="card-footer">
        {/* Avatars Stack */}
        <div className="avatar-stack">
          {note.avatars &&
            note.avatars.map((av, index) => (
              <img
                key={index}
                src={av.avatarUrl}
                alt={av.name}
                className="avatar-item"
              />
            ))}
          {note.moreAvatarsCount && note.moreAvatarsCount > 0 ? (
            <div className="avatar-item avatar-badge">
              +{note.moreAvatarsCount}
            </div>
          ) : null}
        </div>

        {/* Reminder Time Tag */}
        {note.reminder && (
          <div
            className={`reminder-badge ${
              note.reminder.isUrgent ? 'urgent' : ''
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
