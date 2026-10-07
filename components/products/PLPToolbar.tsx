'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface PLPToolbarProps {
  totalCount: number;
  currentSort: string;
  pageStart?: number;
  hasNextPage?: boolean;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function PLPToolbar({
  totalCount,
  currentSort,
  pageStart = 1,
  hasNextPage = false,
  viewMode,
  onViewModeChange,
}: PLPToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val) {
      params.set('sort', val);
    } else {
      params.delete('sort');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const pageEnd = pageStart + totalCount - 1;

  return (
    <div className="plptoolbar">
      <span>
        Showing {pageStart}–{pageEnd}{!hasNextPage ? ` of ${pageEnd}` : '+'} product{totalCount !== 1 ? 's' : ''}
      </span>
      <div className="toolgroup">
        <select
          className="softselect"
          value={currentSort}
          onChange={handleSortChange}
          aria-label="Sort products"
        >
          <option value="">Best sellers</option>
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <div className="viewtoggle" role="group" aria-label="Product view">
          <button
            type="button"
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
