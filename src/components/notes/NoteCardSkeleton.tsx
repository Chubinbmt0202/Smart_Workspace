import React from 'react';
import { Skeleton } from '@radix-ui/themes';

export interface NoteCardSkeletonProps {
  className?: string;
}

export const NoteCardSkeleton: React.FC<NoteCardSkeletonProps> = ({ className = '' }) => {
  return (
    <article className={`note-card note-card-skeleton ${className}`} aria-busy="true">
      {/* Top Row: Tag badge + options circle */}
      <div className="card-top-row">
        <Skeleton width="76px" height="24px" style={{ borderRadius: 20 }} />
        <Skeleton width="22px" height="22px" style={{ borderRadius: '50%' }} />
      </div>

      {/* Date & Attachments row */}
      <div className="card-meta-row" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton width="85px" height="15px" style={{ borderRadius: 6 }} />
        <Skeleton width="40px" height="15px" style={{ borderRadius: 6 }} />
      </div>

      {/* Title */}
      <div style={{ margin: '10px 0 14px 0' }}>
        <Skeleton width="80%" height="22px" style={{ borderRadius: 6 }} />
      </div>

      {/* Content lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, flex: 1 }}>
        <Skeleton width="100%" height="14px" style={{ borderRadius: 4 }} />
        <Skeleton width="92%" height="14px" style={{ borderRadius: 4 }} />
        <Skeleton width="65%" height="14px" style={{ borderRadius: 4 }} />
      </div>

      {/* Footer / Reminder */}
      <div className="card-footer" style={{ marginTop: 'auto' }}>
        <Skeleton width="130px" height="24px" style={{ borderRadius: 14 }} />
      </div>
    </article>
  );
};

export default NoteCardSkeleton;
