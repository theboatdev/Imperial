import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import FaqHubClient from './FaqHubClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('faqHubTitle'),
    description: t('faqHubDescription'),
  };
}

export default async function FaqHubPage() {
  const t = await getTranslations('FaqHub');
  const tCommon = await getTranslations('Common');

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCommon('home')}</Link>
        {' / '}
        <span>{t('breadcrumb')}</span>
      </div>

      <div className="store-frame" style={{ padding: '28px 28px 80px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          {/* Page header: visual + copy (image-led) */}
          <header
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 0.9fr) minmax(0, 1.1fr)',
              gap: '28px',
              alignItems: 'stretch',
              marginBottom: '48px',
            }}
            className="faq-hub-header"
          >
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
                src="/category-tools.webp"
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
                  background: 'linear-gradient(180deg, transparent 40%, rgba(7, 27, 70, 0.6) 100%)',
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
                {t('intro')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link href="/rfq" className="btn primary" style={{ textDecoration: 'none' }}>
                  {t('ctaQuote')}
                </Link>
                <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
                  {t('ctaContact')}
                </Link>
              </div>
            </div>
          </header>

          <FaqHubClient />

          {/* CTA strip */}
          <section
            style={{
              marginTop: '52px',
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
              <Link href="/uae-project-supply" className="btn primary" style={{ textDecoration: 'none', background: '#fff', color: 'var(--navy)' }}>
                {t('ctaProject')}
              </Link>
              <Link href="/contact-us" className="hero-link" style={{ color: '#fff', opacity: 0.95 }}>
                {t('ctaContact')}
                <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          <style>{`
            @media (max-width: 820px) {
              .faq-hub-header {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
