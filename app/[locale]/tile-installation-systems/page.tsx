import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import TileSystemsFaq from './TileSystemsFaq';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('tileSystemsTitle'),
    description: t('tileSystemsDescription'),
  };
}

export default async function TileInstallationSystemsPage() {
  const t = await getTranslations('TileSystems');
  const tCommon = await getTranslations('Common');

  const infoItems = [0, 1, 2, 3, 4, 5].map((i) => t(`infoItems.${i}`));

  const related = [
    {
      href: '/products?collection=adhesive',
      label: t('relatedAdhesives'),
      hint: t('relatedHints.0'),
      image: '/collections/adhesive.webp',
    },
    {
      href: '/products?collection=waterproofing',
      label: t('relatedWaterproofing'),
      hint: t('relatedHints.1'),
      image: '/collections/waterproofing.webp',
    },
    {
      href: '/products?collection=sealent',
      label: t('relatedSealants'),
      hint: t('relatedHints.2'),
      image: '/collections/sealent.webp',
    },
    {
      href: '/products',
      label: t('relatedTools'),
      hint: t('relatedHints.3'),
      image: '/category-tools.webp',
    },
  ] as const;

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
            className="tile-systems-header"
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
                <Link href="/rfq" className="btn primary" style={{ textDecoration: 'none' }}>
                  {t('ctaQuote')}
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
                src="/Gemini_Generated_Image_s18lxes18lxes18l.webp"
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

          {/* Overview */}
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
              {t('overviewTitle')}
            </h2>
            <p style={{ fontSize: '14.5px', lineHeight: 1.8, color: 'var(--muted)', margin: 0, textAlign: 'justify' }}>
              {t('overview')}
            </p>
          </section>

          {/* Information to send */}
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
                {t('infoTitle')}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--faint)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {t('infoHint')}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {infoItems.map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    padding: '16px 16px',
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

          {/* Related ranges — prominent */}
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
              {t('relatedTitle')}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.6 }}>
              {t('relatedIntro')}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '14px',
              }}
              className="tile-systems-related"
            >
              {related.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  style={{
                    display: 'grid',
                    gridTemplateRows: '140px 1fr',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-panel)',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    boxShadow: 'var(--sh-track)',
                    transition: 'border-color var(--motion), box-shadow var(--motion), transform var(--motion)',
                  }}
                >
                  <div style={{ position: 'relative', background: 'var(--slot)' }}>
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, 40vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 40%, rgba(7, 27, 70, 0.35) 100%)',
                      }}
                    />
                  </div>
                  <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', padding: '16px 18px 18px' }}>
                    <span>
                      <span style={{ display: 'block', color: 'var(--navy)', fontSize: '15px', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.01em' }}>
                        {item.label}
                      </span>
                      <span style={{ display: 'block', color: 'var(--muted)', fontSize: '13px', lineHeight: 1.55 }}>
                        {item.hint}
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
                  </span>
                </Link>
              ))}
            </div>
            <style>{`
              @media (max-width: 820px) {
                .tile-systems-header {
                  grid-template-columns: 1fr !important;
                }
              }
              @media (max-width: 700px) {
                .tile-systems-related {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </section>

          {/* Support + CTAs */}
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
              {t('uaeSupport')}
            </p>
            <Link href="/rfq" className="hero-link" style={{ color: '#fff', opacity: 0.95 }}>
              {t('ctaSiteVisit')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
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
            <TileSystemsFaq />
          </section>
        </div>
      </div>
    </>
  );
}
