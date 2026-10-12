import React from 'react';
import { FilePlus2, SearchX, Plus } from 'lucide-react';

interface EmptyStateProps {
  category: string;
  searchQuery?: string;
  onOpenAddModal: () => void;
  onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  category,
  searchQuery,
  onOpenAddModal,
  onClearSearch
}) => {
  const isSearchEmpty = Boolean(searchQuery && searchQuery.trim());

  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-wrapper">
        {isSearchEmpty ? (
          <SearchX size={36} className="empty-state-icon" />
        ) : (
          <FilePlus2 size={36} className="empty-state-icon" />
        )}
      </div>

      <h3 className="empty-state-title">
        {isSearchEmpty
          ? `Không tìm thấy kết quả cho "${searchQuery}"`
          : `Chưa có ghi chú nào trong "${category}"`}
      </h3>

      <p className="empty-state-description">
        {isSearchEmpty
          ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm.'
          : 'Hãy bắt đầu tạo ghi chú đầu tiên để lưu lại ý tưởng, công việc và mục tiêu của bạn.'}
      </p>

      <div className="empty-state-actions">
        {isSearchEmpty && onClearSearch && (
          <button
            type="button"
            className="btn-empty-clear"
            onClick={onClearSearch}
          >
            Xóa tìm kiếm
          </button>
        )}

        <button
          type="button"
          className="btn-empty-create"
          onClick={onOpenAddModal}
        >
          <Plus size={16} />
          <span>Tạo ghi chú mới</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
