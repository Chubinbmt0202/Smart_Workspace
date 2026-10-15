import React from 'react';
import { NoteCardSkeleton } from './NoteCardSkeleton';

export interface NotesGridSkeletonProps {
  count?: number;
}

export const NotesGridSkeleton: React.FC<NotesGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="notes-grid" data-testid="notes-skeleton-grid" aria-label="Đang tải ghi chú...">
      {Array.from({ length: count }).map((_, index) => (
        <NoteCardSkeleton key={`note-skeleton-${index}`} />
      ))}
    </div>
  );
};

export default NotesGridSkeleton;
