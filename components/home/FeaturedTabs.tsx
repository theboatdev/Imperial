'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'featured', label: t('featured') },
    { id: 'bestSellers', label: t('bestSellers') },
    { id: 'rewards', label: t('rewards') },
    { id: 'promotional', label: t('promotional') },
  ];

  // Home page passes a curated product list — show it across tabs for now
  const currentProducts = products ?? [];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || currentProducts.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let rafId = 0;
    const speed = 0.55; // px per frame at ~60fps — scrolls left

    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current += speed;
        const half = track.scrollWidth / 2;
        if (half > 0 && offsetRef.current >= half) {
          offsetRef.current -= half;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    offsetRef.current = 0;
    track.style.transform = 'translate3d(0, 0, 0)';
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [currentProducts, activeTab]);

  const renderGroup = (keyPrefix: string, ariaHidden?: boolean) => (
    <div
      className="discover-marquee-group"
      key={keyPrefix}
      aria-hidden={ariaHidden || undefined}
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'stretch',
        gap: 16,
        paddingRight: 16,
        flex: '0 0 auto',
      }}
    >
      {currentProducts.map((product, i) => (
        <div
          key={`${keyPrefix}-${product.id}`}
          className="discover-marquee-item"
          style={{
            boxSizing: 'border-box',
            flex: '0 0 220px',
            width: 220,
            minWidth: 220,
            maxWidth: 220,
          }}
        >
          <ProductCard product={product} priority={!ariaHidden && i < 4} />
        </div>
      ))}
    </div>
  );

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
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
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
              transition: 'all var(--motion)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentProducts.length > 0 ? (
        <div
          className="discover-marquee"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onFocusCapture={() => {
            pausedRef.current = true;
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              pausedRef.current = false;
            }
          }}
        >
          <div
            className="discover-marquee-track"
            ref={trackRef}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'stretch',
              width: 'max-content',
              willChange: 'transform',
            }}
          >
            {renderGroup('a')}
            {renderGroup('b', true)}
          </div>
        </div>
      ) : (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--muted)' }}>
          <p>{t('noProducts')}</p>
        </div>
      )}
    </div>
  );
}
