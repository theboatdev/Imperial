'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import ProductCard from '@/components/products/ProductCard';
import type { ShopifyProduct } from '@/lib/types';

interface FeaturedTabsProps {
  products: ShopifyProduct[];
}

type TabId = 'featured' | 'bestSellers' | 'rewards' | 'promotional';

export default function FeaturedTabs({ products }: FeaturedTabsProps) {
  const t = useTranslations('Home');
  const [activeTab, setActiveTab] = useState<TabId>('featured');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'featured', label: t('featured') },
    { id: 'bestSellers', label: t('bestSellers') },
    { id: 'rewards', label: t('rewards') },
    { id: 'promotional', label: t('promotional') },
  ];

  // Simulate different content based on tabs for demonstration
  // In a real app, you would fetch distinct collections for each tab
  const getTabProducts = () => {
    if (!products || products.length === 0) return [];

    switch (activeTab) {
      case 'bestSellers':
        return [...products].reverse().slice(0, 8);
      case 'rewards':
        return products.slice(2, 6);
      case 'promotional':
        return products.slice(4, 8);
      case 'featured':
      default:
        return products.slice(0, 8);
    }
  };

  const currentProducts = getTabProducts();

  return (
    <div className="section">
      <div className="sectionhead" style={{ marginBottom: '16px' }}>
        <div>
          <div className="kicker">{t('curated')}</div>
          <h3 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>{t('discoverProducts')}</h3>
        </div>
        <Link href="/products" className="viewall">
          <span className="dot">
            <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
          {t('viewAll')}
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'var(--navy)' : 'var(--line)',
              background: activeTab === tab.id ? 'var(--navy)' : '#fff',
              color: activeTab === tab.id ? '#fff' : 'var(--muted)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--motion)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentProducts.length > 0 ? (
        <div className="prodgrid">
          {currentProducts.map((product, i) => (
            <ProductCard key={`${activeTab}-${product.id}`} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--muted)' }}>
          <p>{t('noProducts')}</p>
        </div>
      )}
    </div>
  );
}
