import React, { useEffect } from 'react';
import { Download, X } from 'lucide-react';
import type { NoteAttachment } from '../utils/attachment';
import { getAttachmentPreviewKind } from '../utils/attachment';

export interface AttachmentPreviewProps {
  attachment: NoteAttachment;
  onClose: () => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onClose
}) => {
  const previewKind = getAttachmentPreviewKind(attachment);
  const fileUrl = attachment.url;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="attachment-preview-backdrop" onClick={onClose}>
      <section
        className="attachment-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Xem trước ${attachment.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="attachment-preview-header">
          <div className="attachment-preview-heading">
            <strong>{attachment.name}</strong>
            {attachment.size && <span>{attachment.size}</span>}
          </div>
          <div className="attachment-preview-actions">
            {fileUrl && (
              <a
                className="attachment-preview-download"
                href={fileUrl}
                download={attachment.name}
                aria-label={`Tải xuống ${attachment.name}`}
                title="Tải xuống"
              >
                <Download size={17} />
              </a>
            )}
            <button
              type="button"
              className="attachment-preview-close"
              onClick={onClose}
              aria-label="Đóng xem trước"
            >
              <X size={19} />
            </button>
          </div>
        </header>
        <div className="attachment-preview-content">
          {!fileUrl || !previewKind ? (
            <p className="attachment-preview-unavailable">
              {!fileUrl
                ? 'Không có dữ liệu tệp để xem trước. Tệp này chưa được tải lên máy chủ.'
                : 'Định dạng này chưa hỗ trợ xem trước trực tiếp. Bạn có thể tải tệp xuống để mở.'}
            </p>
          ) : previewKind === 'image' ? (
            <img src={fileUrl} alt={attachment.name} />
          ) : (
            <iframe
              src={fileUrl}
              title={`Xem trước ${attachment.name}`}
              className="attachment-preview-frame"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AttachmentPreview;
