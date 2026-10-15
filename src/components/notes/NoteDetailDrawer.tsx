import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Trash2,
  Pin,
  Clock,
  Paperclip,
  Calendar,
  Check,
  Tag,
  Download,
  Plus,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Eye
} from 'lucide-react';
import type { NoteItem } from '../../types/note';
import type { TagItem } from '../../types/tag';
import { getTagColor, getTagColorClass } from '../../utils/tagColor';
import { parseNoteDate } from '../../utils/date';
import { AttachmentPreview } from '../AttachmentPreview';
import {
  MAX_ATTACHMENT_SIZE_BYTES,
  type NoteAttachment
} from '../../utils/attachment';

const padNumber = (value: number) => String(value).padStart(2, '0');

function getReminderDateTimeValue(note: NoteItem): string {
  const reminderDate = note.day_notice ? new Date(note.day_notice) : null;
  let date = reminderDate && !Number.isNaN(reminderDate.getTime())
    ? reminderDate
    : null;

  if (!date) {
    const parsedNoteDate = parseNoteDate(note);
    const reminderTime = note.reminder?.time?.replace('.', ':');
    const timeParts = reminderTime?.split(':').map(Number);
    if (parsedNoteDate) {
      date = new Date(
        parsedNoteDate.year,
        parsedNoteDate.month - 1,
        parsedNoteDate.day,
        timeParts?.[0] ?? 9,
        timeParts?.[1] ?? 0
      );
    } else {
      date = new Date();
    }
  }

  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate()
  )}T${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
}

export interface NoteDetailDrawerProps {
  note: NoteItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  availableTags?: TagItem[];
  onAddNewTag?: (tagName: string) => void;
}

export const NoteDetailDrawer: React.FC<NoteDetailDrawerProps> = ({
  note,
  isOpen,
  onClose,
  onUpdateNote,
  onDeleteNote,
  availableTags = [],
  onAddNewTag
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [reminderDay, setReminderDay] = useState('Today');
  const [reminderTime, setReminderTime] = useState('12.00');
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [avatars, setAvatars] = useState<{ name: string; avatarUrl: string }[]>([]);
  const [attachments, setAttachments] = useState<
    NoteAttachment[]
  >([]);
  const [attachmentError, setAttachmentError] = useState('');
  const [previewAttachment, setPreviewAttachment] =
    useState<NoteAttachment | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when note prop changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTag(note.tag);
      setReminderDay(note.reminder?.day || 'Today');
      setReminderTime(note.reminder?.time || '12.00');
      setReminderDateTime(getReminderDateTimeValue(note));
      setAvatars(note.avatars || []);
      setIsPinned(false);
      setIsSavedRecently(false);

      if (note.attachments && note.attachments.length > 0) {
        setAttachments(note.attachments);
      } else if (note.attachmentCount && note.attachmentCount > 0) {
        const mockFiles = [
          { name: 'Tai_lieu_du_an.pdf', size: '2.4 MB', type: 'application/pdf' },
          {
            name: 'Ke_hoach_chi_tiet.docx',
            size: '1.2 MB',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          },
          {
            name: 'Bang_so_lieu_tong_hop.xlsx',
            size: '850 KB',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        ].slice(0, note.attachmentCount);
        setAttachments(mockFiles);
      } else {
        setAttachments([]);
      }
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

    const reminderDate = new Date(reminderDateTime);
    if (!reminderDateTime || Number.isNaN(reminderDate.getTime())) return;

    const reminderDateLabel = `${padNumber(reminderDate.getDate())}/${padNumber(
      reminderDate.getMonth() + 1
    )}/${reminderDate.getFullYear()}`;
    const reminderTimeValue = `${padNumber(reminderDate.getHours())}:${padNumber(
      reminderDate.getMinutes()
    )}`;
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
      attachments,
      attachmentCount: attachments.length > 0 ? attachments.length : undefined,
      day_notice: reminderDate.toISOString(),
      reminder: {
        time: reminderTimeValue,
        day: reminderDateLabel
      }
    };

    onUpdateNote(updatedNote);
    setReminderTime(reminderTimeValue);
    setReminderDay(reminderDateLabel);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) {
      onDeleteNote(note.id);
      onClose();
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const attachment = attachments[index];
    if (attachment?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setPreviewAttachment((prev) => (
      prev && attachments[index]?.name === prev.name ? null : prev
    ));
  };

  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > MAX_ATTACHMENT_SIZE_BYTES
    );
    if (oversizedFiles.length > 0) {
      setAttachmentError(
        `Mỗi tệp phải có dung lượng tối đa 10 MB. Tệp vượt giới hạn: ${oversizedFiles
          .map((file) => file.name)
          .join(', ')}.`
      );
    } else {
      setAttachmentError('');
    }

    const formatSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const newFiles: NoteAttachment[] = selectedFiles
      .filter((file) => file.size <= MAX_ATTACHMENT_SIZE_BYTES)
      .map((file) => ({
        name: file.name,
        size: formatSize(file.size),
        type: file.type,
        url: URL.createObjectURL(file)
      }));

    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const getFileIcon = (type?: string, name?: string) => {
    const fileName = (name || '').toLowerCase();
    const fileType = (type || '').toLowerCase();

    if (fileType.includes('image') || /\.(png|jpe?g|gif|webp|svg)$/i.test(fileName)) {
      return <FileImage size={18} className="attachment-icon image" />;
    }
    if (fileType.includes('sheet') || fileType.includes('excel') || /\.(xlsx?|csv)$/i.test(fileName)) {
      return <FileSpreadsheet size={18} className="attachment-icon sheet" />;
    }
    if (fileType.includes('pdf') || /\.pdf$/i.test(fileName)) {
      return <FileText size={18} className="attachment-icon pdf" />;
    }
    return <File size={18} className="attachment-icon file" />;
  };

  const allTagNames = Array.from(
    new Set([
      ...availableTags.map((t) => t.label)
    ])
  );

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
            <span
              className={`drawer-tag-badge ${getTagColorClass(tag)}`}
              style={{ backgroundColor: getTagColor(tag, availableTags) }}
            >
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

            {attachments.length > 0 ? (
              <span className="meta-chip">
                <Paperclip size={13} />
                <span>{attachments.length} tệp đính kèm</span>
              </span>
            ) : null}
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

          {/* Tag Selector */}
          <div className="drawer-section">
            <span className="drawer-section-title">Tag</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                className="form-select"
                style={{ padding: '6px 10px', fontSize: '13px', borderRadius: '8px' }}
                value={allTagNames.includes(tag) ? tag : (tag ? tag : 'Personal')}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    const newTag = prompt('Nhập tên tag mới:', '');
                    if (newTag && newTag.trim()) {
                      const trimmed = newTag.trim();
                      setTag(trimmed);
                      onAddNewTag?.(trimmed);
                    }
                  } else {
                    setTag(e.target.value);
                  }
                }}
              >
                {allTagNames.map((tName) => (
                  <option key={tName} value={tName}>
                    {tName}
                  </option>
                ))}
                {!allTagNames.includes(tag) && tag && (
                  <option value={tag}>{tag}</option>
                )}
                <option value="__custom__">+ Tạo tag mới...</option>
              </select>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="drawer-section">
            <div className="drawer-section-header">
              <span className="drawer-section-title">
                Tệp đính kèm ({attachments.length})
              </span>
              <button
                type="button"
                className="btn-drawer-add-file"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={13} />
                <span>Thêm tệp</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  handleAddFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>

            {attachmentError && (
              <p className="upload-file-error" role="alert">
                {attachmentError}
              </p>
            )}

            {attachments.length > 0 ? (
              <div className="drawer-attachments-list">
                {attachments.map((file, idx) => (
                  <div key={`${file.name}-${idx}`} className="drawer-attachment-card">
                    <div className="attachment-card-left">
                      <div className="attachment-icon-box">
                        {getFileIcon(file.type, file.name)}
                      </div>
                      <div className="attachment-card-info">
                        <span className="attachment-name" title={file.name}>
                          {file.name}
                        </span>
                        {file.size && (
                          <span className="attachment-size">{file.size}</span>
                        )}
                      </div>
                    </div>
                    <div className="attachment-card-actions">
                      <button
                        type="button"
                        className="btn-attachment-action"
                        onClick={() => setPreviewAttachment(file)}
                        title={`Xem trước ${file.name}`}
                        aria-label={`Xem trước ${file.name}`}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-attachment-action"
                        onClick={() => {
                          if (file.url) {
                            window.open(file.url, '_blank', 'noopener,noreferrer');
                          } else {
                            setPreviewAttachment(file);
                          }
                        }}
                        title="Tải xuống tệp"
                        aria-label="Tải xuống"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-attachment-action delete"
                        onClick={() => handleRemoveAttachment(idx)}
                        title="Xóa tệp đính kèm"
                        aria-label="Xóa tệp"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="drawer-attachments-empty">
                <Paperclip size={16} />
                <span>Chưa có tệp đính kèm nào</span>
              </div>
            )}
          </div>

          {/* Reminder Section */}
          <div className="drawer-section">
            <span className="drawer-section-title">Nhắc nhở</span>
            <div className="drawer-reminder-box">
              <div className="drawer-reminder-editor">
                <label className="drawer-reminder-field">
                  <span>Ngày và giờ</span>
                  <input
                    type="datetime-local"
                    value={reminderDateTime}
                    onChange={(event) => setReminderDateTime(event.target.value)}
                    aria-label="Ngày và giờ nhắc nhở"
                  />
                </label>
                <div className="drawer-reminder-info">
                  <Clock size={18} className="drawer-reminder-icon" />
                  <div className="drawer-reminder-text">
                    <span className="drawer-reminder-time">{reminderTime}</span>
                    <span className="drawer-reminder-day">{reminderDay}</span>
                  </div>
                </div>
              </div>
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
      {previewAttachment && (
        <AttachmentPreview
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </>
  );
};

export default NoteDetailDrawer;
