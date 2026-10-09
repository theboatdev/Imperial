import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import UaeServiceAreasFaq from './UaeServiceAreasFaq';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('uaeServiceAreasTitle'),
    description: t('uaeServiceAreasDescription'),
  };
}

const EMIRATE_KEYS = [
  'abuDhabi',
  'dubai',
  'sharjah',
  'ajman',
  'ummAlQuwain',
  'rasAlKhaimah',
  'fujairah',
] as const;

export default async function UaeServiceAreasPage() {
  const t = await getTranslations('UaeServiceAreas');
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
          {/* Page header: copy + visual */}
          <header
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.15fr) minmax(240px, 0.85fr)',
              gap: '28px',
              alignItems: 'stretch',
              marginBottom: '48px',
            }}
            className="uae-areas-header"
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
                <Link href="/uae-project-supply" className="btn primary" style={{ textDecoration: 'none' }}>
                  {t('ctaPricing')}
                </Link>
                <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
                  {t('ctaContact')}
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
                src="/hero_banner_1786348994479.webp"
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

          {/* Consolidated note */}
          <section
            style={{
              marginBottom: '40px',
              padding: '22px 24px',
              background: 'linear-gradient(135deg, var(--slot) 0%, #fff 55%)',
              borderRadius: 'var(--r-panel)',
              border: '1px solid var(--line)',
            }}
          >
            <h2 style={{ color: 'var(--navy)', fontSize: '16px', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              {t('noteTitle')}
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--muted)', margin: 0, textAlign: 'justify' }}>
              {t('consolidatedNote')}
            </p>
          </section>

          {/* Emirates grid */}
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
              {t('emiratesTitle')}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.6 }}>
              {t('emiratesIntro')}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '14px',
              }}
              className="uae-areas-emirates"
            >
              {EMIRATE_KEYS.map((key, i) => (
                <article
                  key={key}
                  style={{
                    padding: '20px 22px',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-panel)',
                    boxShadow: 'var(--sh-track)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--imperial-blue)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 style={{ color: 'var(--navy)', fontSize: '16px', margin: 0, fontWeight: 700, letterSpacing: '-0.01em' }}>
                      {t(`emirates.${key}.name`)}
                    </h3>
                  </div>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
                    {t(`emirates.${key}.body`)}
                  </p>
                </article>
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
              <Link href="/uae-project-supply" className="btn primary" style={{ textDecoration: 'none', background: '#fff', color: 'var(--navy)' }}>
                {t('ctaPricing')}
              </Link>
              <Link href="/rfq" className="hero-link" style={{ color: '#fff', opacity: 0.95 }}>
                {t('ctaRfq')}
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
            <UaeServiceAreasFaq />
          </section>

          <style>{`
            @media (max-width: 820px) {
              .uae-areas-header {
                grid-template-columns: 1fr !important;
              }
            }
            @media (max-width: 700px) {
              .uae-areas-emirates {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
