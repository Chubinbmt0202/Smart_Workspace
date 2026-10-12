import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { NoteItem } from '../types/note';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (newNote: NoteItem) => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onAddNote
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Personal' | 'Projects' | 'Business'>('Personal');
  const [attachments, setAttachments] = useState('2');
  const [reminderDay, setReminderDay] = useState('Today');
  const [isUrgent, setIsUrgent] = useState(false);

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
      reminder: reminderDay ? {
        time: '12.00',
        day: reminderDay,
        isUrgent: isUrgent || reminderDay === 'Today'
      } : undefined
    };

    onAddNote(newNote);
    onClose();
    setTitle('');
    setContent('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Note</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Note Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Design review meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="Personal">Personal</option>
                <option value="Projects">Projects</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Attachments</label>
              <input
                type="number"
                min="0"
                max="10"
                className="form-input"
                placeholder="2"
                value={attachments}
                onChange={(e) => setAttachments(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Content</label>
            <textarea
              className="form-textarea"
              placeholder="Write your note details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Reminder Day</label>
              <select
                className="form-select"
                value={reminderDay}
                onChange={(e) => setReminderDay(e.target.value)}
              >
                <option value="Today">Today (Urgent)</option>
                <option value="Monday">Monday</option>
                <option value="Friday">Friday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 20 }}>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                Mark as Urgent
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
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
