'use client';

import { useState, type ReactNode } from 'react';
import type { ShopifyProduct } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';
import PLPToolbar from '@/components/products/PLPToolbar';

interface PLPProductResultsProps {
  products: ShopifyProduct[];
  currentSort: string;
  pageStart?: number;
  hasNextPage?: boolean;
  children?: ReactNode;
}

export default function PLPProductResults({
  products,
  currentSort,
  pageStart = 1,
  hasNextPage = false,
  children,
}: PLPProductResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <>
      <PLPToolbar
        totalCount={products.length}
        currentSort={currentSort}
        pageStart={pageStart}
        hasNextPage={hasNextPage}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <div className={viewMode === 'list' ? 'prodlist' : 'prodgrid'}>
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} />
        ))}
      </div>
      {children}
    </>
  );
}
