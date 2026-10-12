import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getProductFilters } from '@/lib/shopify-api';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('brandsHubTitle'),
    description: t('brandsHubDescription'),
  };
}

export default async function BrandsHubPage() {
  const t = await getTranslations('BrandsHub');
  const tCommon = await getTranslations('Common');

  let vendors: string[] = [];
  try {
    const filters = await getProductFilters();
    vendors = filters.vendors;
  } catch {
    vendors = [];
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCommon('home')}</Link>
        {' / '}
        <span>{t('breadcrumb')}</span>
      </div>

      <div className="store-frame" style={{ padding: '28px 28px 80px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <header
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.15fr) minmax(240px, 0.85fr)',
              gap: '28px',
              alignItems: 'stretch',
              marginBottom: '40px',
            }}
            className="brands-hub-header"
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 0' }}>
              <div className="kicker" style={{ marginBottom: '14px' }}>{t('kicker')}</div>
              <h1
                style={{
                  color: 'var(--navy)',
                  margin: '0 0 16px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  letterSpacing: '-0.035em',
                  fontSize: 'clamp(28px, 3.4vw, 40px)',
                  lineHeight: 1.12,
                }}
              >
                {t('title')}
              </h1>
              <p style={{ fontSize: '15.5px', lineHeight: 1.8, color: 'var(--text)', margin: '0 0 22px', textAlign: 'justify', maxWidth: '54ch' }}>
                {t('quickAnswer')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a href="#brand-list" className="btn primary" style={{ textDecoration: 'none' }}>
                  {t('ctaExplore')}
                </a>
                <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
                  {t('ctaRequest')}
                </Link>
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                minHeight: '280px',
                borderRadius: 'var(--r-panel)',
                overflow: 'hidden',
                boxShadow: 'var(--sh-soft)',
                background: 'var(--slot)',
              }}
            >
              <Image
                src="/category-chemicals.webp"
                alt={t('title')}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(7, 27, 70, 0.62) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '18px',
                  right: '18px',
                  bottom: '16px',
                  color: '#fff',
                  fontSize: '12.5px',
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                {t('heroLine')}
              </div>
            </div>
          </header>

          <section
            style={{
              marginBottom: '36px',
              padding: '18px 20px',
              background: 'rgba(9, 79, 168, 0.06)',
              borderRadius: 'var(--r-soft)',
              border: '1px solid rgba(9, 79, 168, 0.12)',
            }}
          >
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.7, color: 'var(--text)' }}>
              {t('disclaimer')}
            </p>
          </section>

          <section id="brand-list" style={{ marginBottom: '48px', scrollMarginTop: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <h2
                style={{
                  color: 'var(--navy)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  fontSize: 'clamp(22px, 2.4vw, 28px)',
                  margin: 0,
                }}
              >
                {t('listTitle')}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--faint)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {vendors.length > 0 ? t('listCount', { count: vendors.length }) : t('listEmptyHint')}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.65, maxWidth: '62ch' }}>
              {t('listIntro')}
            </p>

            {vendors.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '12px',
                }}
              >
                {vendors.map((vendor) => (
                  <Link
                    key={vendor}
                    href={`/products?vendor=${encodeURIComponent(vendor)}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '16px 16px',
                      background: '#fff',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-soft)',
                      textDecoration: 'none',
                      boxShadow: 'var(--sh-track)',
                      color: 'var(--navy)',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    <span>{vendor}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '28px 22px',
                  background: 'var(--slot)',
                  borderRadius: 'var(--r-panel)',
                  border: '1px solid var(--line)',
                }}
              >
                <p style={{ margin: '0 0 14px', fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)' }}>
                  {t('emptyBody')}
                </p>
                <Link href="/products" className="btn primary" style={{ textDecoration: 'none' }}>
                  {t('emptyCta')}
                </Link>
              </div>
            )}
          </section>

          <section
            style={{
              padding: '24px 26px',
              borderRadius: 'var(--r-panel)',
              background: 'var(--navy)',
              color: '#fff',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '18px',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, opacity: 0.9, maxWidth: '52ch' }}>
              {t('requestStrip')}
            </p>
            <Link href="/contact-us" className="hero-link" style={{ color: '#fff', opacity: 0.95 }}>
              {t('ctaRequest')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </section>

          <style>{`
            @media (max-width: 820px) {
              .brands-hub-header { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
