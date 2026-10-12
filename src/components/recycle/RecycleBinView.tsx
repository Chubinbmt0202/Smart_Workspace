import React, { useState, useMemo } from 'react';
import {
  Trash2,
  RotateCcw,
  Clock,
  Paperclip,
  Calendar,
  Search,
  AlertTriangle,
  FileText
} from 'lucide-react';
import type { NoteItem } from '../../types/note';

export interface RecycleBinViewProps {
  deletedNotes: NoteItem[];
  onRestoreNote: (id: string) => void;
  onPermanentDeleteNote: (id: string) => void;
  onEmptyRecycleBin: () => void;
  onSelectNote?: (note: NoteItem) => void;
}

/**
 * Calculates how many days have passed since the note was deleted
 */
export function getDaysSinceDeleted(deletedAt?: string): {
  days: number;
  text: string;
  formattedDate: string;
  badgeClass: string;
} {
  if (!deletedAt) {
    return {
      days: 0,
      text: 'Đã xóa hôm nay',
      formattedDate: 'Vừa xong',
      badgeClass: 'badge-today'
    };
  }

  const delDate = new Date(deletedAt);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - delDate.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let text = '';
  let badgeClass = 'badge-days';

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      text = 'Đã xóa hôm nay (vừa xong)';
    } else {
      text = `Đã xóa hôm nay (${diffHours}h trước)`;
    }
    badgeClass = 'badge-today';
  } else if (diffDays === 1) {
    text = 'Đã xóa được 1 ngày';
    badgeClass = 'badge-recent';
  } else {
    text = `Đã xóa được ${diffDays} ngày`;
    if (diffDays > 10) {
      badgeClass = 'badge-old';
    } else {
      badgeClass = 'badge-days';
    }
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedDate = `${pad(delDate.getDate())}/${pad(
    delDate.getMonth() + 1
  )}/${delDate.getFullYear()} ${pad(delDate.getHours())}:${pad(
    delDate.getMinutes()
  )}`;

  return { days: diffDays, text, formattedDate, badgeClass };
}

export const RecycleBinView: React.FC<RecycleBinViewProps> = ({
  deletedNotes,
  onRestoreNote,
  onPermanentDeleteNote,
  onEmptyRecycleBin,
  onSelectNote
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeletedNotes = useMemo(() => {
    if (!searchQuery.trim()) return deletedNotes;
    const q = searchQuery.toLowerCase().trim();
    return deletedNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tag && n.tag.toLowerCase().includes(q))
    );
  }, [deletedNotes, searchQuery]);

  const handleConfirmEmpty = () => {
    if (deletedNotes.length === 0) return;
    if (
      window.confirm(
        'Bạn có chắc chắn muốn dọn sạch toàn bộ thùng rác? Các ghi chú này sẽ bị xóa vĩnh viễn và không thể khôi phục.'
      )
    ) {
      onEmptyRecycleBin();
    }
  };

  const handleConfirmPermanentDelete = (id: string, title: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa vĩnh viễn ghi chú "${title}"? Thao tác này không thể hoàn tác.`
      )
    ) {
      onPermanentDeleteNote(id);
    }
  };

  const getTagClass = (tagType?: string) => {
    if (tagType === 'personal') return 'tag-personal';
    if (tagType === 'projects') return 'tag-projects';
    return 'tag-custom';
  };

  return (
    <div className="recycle-wrapper">

      {/* 3. Notes Grid or Empty State */}
      {filteredDeletedNotes.length > 0 ? (
        <div className="recycle-grid">
          {filteredDeletedNotes.map((note) => {
            const { text: daysText, formattedDate, badgeClass } =
              getDaysSinceDeleted(note.deletedAt);

            return (
              <article
                key={note.id}
                className="recycle-card"
                onClick={() => onSelectNote?.(note)}
              >
                {/* Top strip: Tag & Days Deleted Badge */}
                <div className="recycle-card-header">
                  <span className={`card-tag ${getTagClass(note.tagType)}`}>
                    {note.tag}
                  </span>

                  {/* PROMINENT DAYS DELETED BADGE */}
                  <div
                    className={`recycle-days-badge ${badgeClass}`}
                    title={`Xóa lúc: ${formattedDate}`}
                  >
                    <Clock size={12} className="recycle-badge-icon" />
                    <span>{daysText}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="recycle-card-title" title={note.title}>
                  {note.title}
                </h3>

                {/* Content snippet */}
                <p className="recycle-card-content" title={note.content}>
                  {note.content}
                </p>

                {/* Deletion metadata */}
                <div className="recycle-card-meta">
                  <span className="recycle-meta-item" title="Ngày tạo ban đầu">
                    <Calendar size={13} />
                    <span>Tạo: {note.date}</span>
                  </span>

                  {note.attachmentCount && note.attachmentCount > 0 ? (
                    <span className="recycle-meta-item" title="Tệp đính kèm">
                      <Paperclip size={13} />
                      <span>{note.attachmentCount} tệp</span>
                    </span>
                  ) : null}
                </div>

                <div className="recycle-card-date-deleted">
                  <span>Thời gian xóa: {formattedDate}</span>
                </div>

                {/* Card Actions Footer */}
                <div
                  className="recycle-card-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="btn-recycle-restore"
                    onClick={() => onRestoreNote(note.id)}
                    title="Khôi phục ghi chú này về danh sách chính"
                  >
                    <RotateCcw size={14} />
                    <span>Khôi phục</span>
                  </button>

                  <button
                    type="button"
                    className="btn-recycle-delete"
                    onClick={() =>
                      handleConfirmPermanentDelete(note.id, note.title)
                    }
                    title="Xóa vĩnh viễn ghi chú"
                  >
                    <Trash2 size={14} />
                    <span>Xóa vĩnh viễn</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : deletedNotes.length > 0 && searchQuery ? (
        <div className="recycle-empty-state">
          <div className="recycle-empty-icon">
            <Search size={40} />
          </div>
          <h3 className="recycle-empty-title">Không tìm thấy ghi chú</h3>
          <p className="recycle-empty-desc">
            Không có ghi chú đã xóa nào khớp với từ khóa "{searchQuery}".
          </p>
          <button
            type="button"
            className="btn-recycle-clear-search"
            onClick={() => setSearchQuery('')}
          >
            Xóa tìm kiếm
          </button>
        </div>
      ) : (
        <div className="recycle-empty-state">
          <div className="recycle-empty-icon">
            <Trash2 size={44} />
          </div>
          <h3 className="recycle-empty-title">Thùng rác trống</h3>
          <p className="recycle-empty-desc">
            Hiện tại không có ghi chú nào trong thùng rác. Khi bạn xóa một ghi chú, nó sẽ xuất hiện tại đây cùng số ngày đã xóa.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecycleBinView;
