import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import TechnicalResourcesFaq from './TechnicalResourcesFaq';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('technicalResourcesTitle'),
    description: t('technicalResourcesDescription'),
  };
}

export default async function TechnicalResourcesPage() {
  const t = await getTranslations('TechnicalResources');
  const tCommon = await getTranslations('Common');

  const supportItems = [0, 1, 2, 3, 4, 5, 6].map((i) => t(`supportItems.${i}`));
  const libraryLabels = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => t(`libraryLabels.${i}`));

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCommon('home')}</Link>
        {' / '}
        <span>{t('breadcrumb')}</span>
      </div>

      <div className="store-frame" style={{ padding: '28px 28px 80px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          {/* Page header: copy + visual */}
          <header
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.15fr) minmax(240px, 0.85fr)',
              gap: '28px',
              alignItems: 'stretch',
              marginBottom: '48px',
            }}
            className="tech-resources-header"
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
                <Link href="/products" className="btn primary" style={{ textDecoration: 'none' }}>
                  {t('ctaSearch')}
                </Link>
                <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
                  {t('ctaSupport')}
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
                  background: 'linear-gradient(180deg, transparent 45%, rgba(7, 27, 70, 0.55) 100%)',
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

          {/* Search note */}
          <section
            style={{
              marginBottom: '40px',
              padding: '26px 28px',
              background: 'linear-gradient(135deg, var(--slot) 0%, #fff 55%)',
              borderRadius: 'var(--r-panel)',
              border: '1px solid var(--line)',
            }}
          >
            <h2 style={{ color: 'var(--navy)', fontSize: '18px', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              {t('searchTitle')}
            </h2>
            <p style={{ fontSize: '14.5px', lineHeight: 1.8, color: 'var(--muted)', margin: 0, textAlign: 'justify' }}>
              {t('searchNote')}
            </p>
          </section>

          {/* Support available */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
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
                {t('supportTitle')}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--faint)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {t('supportHint')}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {supportItems.map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    padding: '16px',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-soft)',
                    boxShadow: 'var(--sh-track)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: '22px',
                      height: '22px',
                      borderRadius: '7px',
                      background: 'rgba(9, 79, 168, 0.1)',
                      color: 'var(--imperial-blue)',
                      display: 'grid',
                      placeItems: 'center',
                      marginTop: '1px',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--text)', fontWeight: 500 }}>
                    <span style={{ color: 'var(--faint)', fontSize: '11px', fontWeight: 700, marginRight: '6px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Resource library */}
          <section style={{ marginBottom: '44px' }}>
            <h2
              style={{
                color: 'var(--navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                fontSize: 'clamp(22px, 2.4vw, 28px)',
                margin: '0 0 8px',
              }}
            >
              {t('libraryTitle')}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.6 }}>
              {t('libraryIntro')}
            </p>
            <div style={{ display: 'grid', gap: '10px' }} className="tech-resources-library">
              {libraryLabels.map((label, i) => (
                <Link
                  key={label}
                  href="/products"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '16px 18px',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-soft)',
                    boxShadow: 'var(--sh-track)',
                    textDecoration: 'none',
                    transition: 'border-color var(--motion), box-shadow var(--motion)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(9, 79, 168, 0.1)',
                        color: 'var(--imperial-blue)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </span>
                    <span>
                      <span style={{ display: 'block', color: 'var(--navy)', fontSize: '14.5px', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '2px' }}>
                        {label}
                      </span>
                      <span style={{ display: 'block', color: 'var(--faint)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {t('libraryRowHint')} · {String(i + 1).padStart(2, '0')}
                      </span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--slot)',
                      color: 'var(--navy)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA strip */}
          <section
            style={{
              marginBottom: '52px',
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
              {t('ctaStrip')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/contact-us" className="btn primary" style={{ textDecoration: 'none', background: '#fff', color: 'var(--navy)' }}>
                {t('ctaSupport')}
              </Link>
              <Link href="/rfq" className="hero-link" style={{ color: '#fff', opacity: 0.95 }}>
                {t('ctaUpload')}
                <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2
              style={{
                color: 'var(--navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                fontSize: 'clamp(22px, 2.4vw, 28px)',
                margin: '0 0 18px',
              }}
            >
              {t('faqTitle')}
            </h2>
            <TechnicalResourcesFaq />
          </section>

          <style>{`
            @media (max-width: 820px) {
              .tech-resources-header {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
