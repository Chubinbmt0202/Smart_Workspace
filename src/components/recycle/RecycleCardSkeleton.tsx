import React from 'react';
import { Skeleton } from '@radix-ui/themes';

export const RecycleCardSkeleton: React.FC = () => {
  return (
    <article className="recycle-card recycle-card-skeleton" aria-busy="true">
      <div className="recycle-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="70px" height="24px" style={{ borderRadius: 20 }} />
        <Skeleton width="115px" height="22px" style={{ borderRadius: 12 }} />
      </div>

      <div style={{ margin: '14px 0 10px 0' }}>
        <Skeleton width="75%" height="20px" style={{ borderRadius: 6 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <Skeleton width="100%" height="14px" style={{ borderRadius: 4 }} />
        <Skeleton width="88%" height="14px" style={{ borderRadius: 4 }} />
      </div>

      <div className="recycle-card-meta" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Skeleton width="110px" height="15px" style={{ borderRadius: 4 }} />
      </div>

      <div className="recycle-card-actions" style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <Skeleton width="100px" height="32px" style={{ borderRadius: 8, flex: 1 }} />
        <Skeleton width="85px" height="32px" style={{ borderRadius: 8 }} />
      </div>
    </article>
  );
};

export const RecycleGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="recycle-grid" data-testid="recycle-skeleton-grid" aria-label="Đang tải thùng rác...">
      {Array.from({ length: count }).map((_, i) => (
        <RecycleCardSkeleton key={`recycle-skeleton-${i}`} />
      ))}
    </div>
  );
};

export default RecycleGridSkeleton;
