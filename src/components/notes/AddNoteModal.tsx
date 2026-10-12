import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Clock,
  Calendar,
  Tag as TagIcon,
  Check,
  Plus
} from 'lucide-react';
import type { NoteItem } from '../../types/note';
import type { TagItem } from '../../types/tag';

export interface UploadedDoc {
  name: string;
  size: string;
  type: string;
}

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
  // 1. Title
  const [title, setTitle] = useState('');

  // 2. Tag
  const [category, setCategory] = useState<string>(
    defaultCategory !== 'All' ? defaultCategory : 'Personal'
  );
  const [customTag, setCustomTag] = useState('');

  // 3. Description
  const [description, setDescription] = useState('');

  // 4. Time: Hour, Date (Day), Month, Year
  const now = new Date();
  const currentHourStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
  const [hour, setHour] = useState<string>(currentHourStr);
  const [day, setDay] = useState<number>(now.getDate());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());

  // 5. Upload Document
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDoc[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync category & defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      setCategory(defaultCategory !== 'All' ? defaultCategory : 'Personal');
      setCustomTag('');
      const openNow = new Date();
      setHour(
        `${String(openNow.getHours()).padStart(2, '0')}:${String(
          openNow.getMinutes()
        ).padStart(2, '0')}`
      );
      setDay(openNow.getDate());
      setMonth(openNow.getMonth() + 1);
      setYear(openNow.getFullYear());
    }
  }, [isOpen, defaultCategory]);

  if (!isOpen) return null;

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle uploaded files
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newDocs: UploadedDoc[] = Array.from(files).map((f) => ({
      name: f.name,
      size: formatFileSize(f.size),
      type: f.type
    }));

    setUploadedFiles((prev) => [...prev, ...newDocs]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string, name: string) => {
    if (type.includes('image') || /\.(png|jpe?g|gif|webp|svg)$/i.test(name)) {
      return <FileImage size={18} className="file-item-icon" />;
    }
    if (type.includes('sheet') || type.includes('excel') || /\.(xlsx?|csv)$/i.test(name)) {
      return <FileSpreadsheet size={18} className="file-item-icon" />;
    }
    if (type.includes('pdf') || type.includes('word') || type.includes('text') || /\.(pdf|docx?|txt)$/i.test(name)) {
      return <FileText size={18} className="file-item-icon" />;
    }
    return <File size={18} className="file-item-icon" />;
  };

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

    const formattedDate = `${day}.${month}.${year}`;
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
      attachmentCount: uploadedFiles.length > 0 ? uploadedFiles.length : undefined,
      attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      title: title.trim(),
      content: description.trim() || 'Không có mô tả chi tiết.',
      avatars: [
        {
          name: 'Josh',
          avatarUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
        }
      ],
      reminder: {
        time: hour,
        day: `${day}/${month}/${year}`
      }
    };

    onAddNote(newNote);
    onClose();
    setTitle('');
    setDescription('');
    setCustomTag('');
    setUploadedFiles([]);
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
          <h2 id="modal-title">
            <Plus size={20} style={{ color: '#f69424' }} />
            Tạo ghi chú mới (Add Note)
          </h2>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* 1. Title */}
          <div className="form-group">
            <label htmlFor="note-title">Tiêu đề (Title) *</label>
            <input
              id="note-title"
              type="text"
              className="form-input"
              placeholder="Nhập tiêu đề ghi chú..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* 2. Tag */}
          <div className="form-group">
            <label htmlFor="note-category">
              <TagIcon size={14} />
              Thẻ / Danh mục (Tag)
            </label>
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

          {/* 3. Description */}
          <div className="form-group">
            <label htmlFor="note-description">Mô tả / Nội dung (Description)</label>
            <textarea
              id="note-description"
              className="form-textarea"
              rows={4}
              placeholder="Nhập mô tả nội dung ghi chú..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 4. Time: Hour, Date (Day), Month, Year */}
          <div className="form-group">
            <label>
              <Clock size={14} />
              Thời gian
            </label>

            <div className="time-grid">
              {/* Hour */}
              <div className="time-sub-group">
                <span className="time-sub-label">Giờ (Hour)</span>
                <input
                  type="time"
                  className="form-input"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  required
                />
              </div>

              {/* Day */}
              <div className="time-sub-group">
                <span className="time-sub-label">Ngày (Date)</span>
                <select
                  className="form-select"
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value, 10))}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Ngày {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div className="time-sub-group">
                <span className="time-sub-label">Tháng (Month)</span>
                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      Tháng {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="time-sub-group">
                <span className="time-sub-label">Năm (Year)</span>
                <select
                  className="form-select"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10))}
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="time-preview-badge">
              <Calendar size={13} />
              <span>
                Đã chọn: {hour} - Ngày {day} tháng {month}, năm {year}
              </span>
            </div>
          </div>

          {/* 5. Upload Document */}
          <div className="form-group">
            <label>
              <UploadCloud size={14} />
              Tải lên tài liệu (Upload Document)
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleFilesSelected(e.target.files)}
            />

            {/* Dropzone */}
            <div
              className={`upload-dropzone ${isDragOver ? 'drag-active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFilesSelected(e.dataTransfer.files);
              }}
            >
              <div className="upload-icon-wrapper">
                <UploadCloud size={22} />
              </div>
              <p className="upload-prompt-text">
                Kéo thả tài liệu vào đây hoặc
                <span className="upload-link">chọn từ thiết bị</span>
              </p>
              <span className="upload-subtext">
                Hỗ trợ PDF, DOCX, XLSX, TXT, PNG, JPG (Có thể chọn nhiều tệp)
              </span>
            </div>

            {/* Uploaded Files Preview List */}
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files-list">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="uploaded-file-item">
                    <div className="file-item-left">
                      {getFileIcon(file.type, file.name)}
                      <div className="file-item-info">
                        <span className="file-item-name" title={file.name}>
                          {file.name}
                        </span>
                        <span className="file-item-size">{file.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-remove-file"
                      onClick={() => handleRemoveFile(index)}
                      title="Xóa tệp này"
                      aria-label="Xóa tệp này"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              <Check size={16} />
              <span>Lưu ghi chú</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
