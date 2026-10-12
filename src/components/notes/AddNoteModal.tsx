import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { NoteItem } from '../../types/note';

export interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (newNote: NoteItem) => void;
  defaultCategory?: string;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onAddNote,
  defaultCategory = 'Personal'
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const initialCat = ['Personal', 'Projects', 'Business'].includes(defaultCategory)
    ? (defaultCategory as 'Personal' | 'Projects' | 'Business')
    : 'Personal';
  const [category, setCategory] = useState<'Personal' | 'Projects' | 'Business'>(initialCat);
  const [attachments, setAttachments] = useState('2');
  const [reminderDay, setReminderDay] = useState('Today');
  const [isUrgent, setIsUrgent] = useState(false);

  // Sync category when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (['Personal', 'Projects', 'Business'].includes(defaultCategory)) {
        setCategory(defaultCategory as 'Personal' | 'Projects' | 'Business');
      }
    }
  }, [isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const todayDate = new Date();
    const formattedDate = `${todayDate.getDate()}.${todayDate.getMonth() + 1}.${todayDate.getFullYear()}`;

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      tag: category,
      tagType: category === 'Personal' ? 'personal' : 'projects',
      date: formattedDate,
      attachmentCount: attachments ? parseInt(attachments, 10) : undefined,
      title: title.trim(),
      content: content.trim() || 'No description provided.',
      avatars: [
        {
          name: 'Josh',
          avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
        }
      ],
      reminder: reminderDay
        ? {
            time: '12.00',
            day: reminderDay,
            isUrgent: isUrgent || reminderDay === 'Today'
          }
        : undefined
    };

    onAddNote(newNote);
    onClose();
    setTitle('');
    setContent('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">Create New Note</h2>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              type="text"
              className="form-input"
              placeholder="e.g. Weekly Design Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="note-category">Category</label>
              <select
                id="note-category"
                className="form-select"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as 'Personal' | 'Projects' | 'Business'
                  )
                }
              >
                <option value="Personal">Personal</option>
                <option value="Projects">Projects</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="note-attachments">Attachments</label>
              <input
                id="note-attachments"
                type="number"
                min="0"
                max="10"
                className="form-input"
                value={attachments}
                onChange={(e) => setAttachments(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="note-reminder-day">Reminder Day</label>
              <select
                id="note-reminder-day"
                className="form-select"
                value={reminderDay}
                onChange={(e) => setReminderDay(e.target.value)}
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Next Week">Next Week</option>
              </select>
            </div>

            <div className="form-group half checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <span>Mark as urgent (Red badge)</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="form-textarea"
              rows={4}
              placeholder="Write your note description here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
