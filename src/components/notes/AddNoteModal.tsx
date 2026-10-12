import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { NoteItem } from '../../types/note';
import type { TagItem } from '../../types/tag';

export interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (newNote: NoteItem) => void;
  defaultCategory?: string;
  availableTags?: TagItem[];
  onAddNewTag?: (tagName: string) => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onAddNote,
  defaultCategory = 'Personal',
  availableTags = [],
  onAddNewTag
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>(
    defaultCategory !== 'All' ? defaultCategory : 'Personal'
  );
  const [customTag, setCustomTag] = useState('');
  const [attachments, setAttachments] = useState('2');
  const [reminderDay, setReminderDay] = useState('Today');
  const [isUrgent, setIsUrgent] = useState(false);

  // Sync category when modal opens
  useEffect(() => {
    if (isOpen) {
      setCategory(defaultCategory !== 'All' ? defaultCategory : 'Personal');
      setCustomTag('');
    }
  }, [isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalTag = category;
    if (category === '__custom__') {
      const trimmedCustom = customTag.trim();
      if (!trimmedCustom) return;
      finalTag = trimmedCustom;
      onAddNewTag?.(trimmedCustom);
    }

    const todayDate = new Date();
    const formattedDate = `${todayDate.getDate()}.${todayDate.getMonth() + 1}.${todayDate.getFullYear()}`;

    const finalTagLower = finalTag.toLowerCase();
    const tagType =
      finalTagLower === 'personal'
        ? 'personal'
        : finalTagLower === 'projects'
        ? 'projects'
        : 'custom';

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      tag: finalTag,
      tagType,
      date: formattedDate,
      attachmentCount: attachments ? parseInt(attachments, 10) : undefined,
      title: title.trim(),
      content: content.trim() || 'No description provided.',
      avatars: [
        {
          name: 'Josh',
          avatarUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
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
    setCustomTag('');
  };

  // Build unique tag options
  const baseTagNames = ['Personal', 'Projects', 'Business'];
  const allTagNames = Array.from(
    new Set([
      ...baseTagNames,
      ...availableTags.map((t) => t.label)
    ])
  );

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
              <label htmlFor="note-category">Category / Tag</label>
              <select
                id="note-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {allTagNames.map((tagName) => (
                  <option key={tagName} value={tagName}>
                    {tagName}
                  </option>
                ))}
                <option value="__custom__">+ Thêm tag mới...</option>
              </select>

              {category === '__custom__' && (
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập tên tag mới..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  style={{ marginTop: '8px' }}
                  required
                  autoFocus
                />
              )}
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
