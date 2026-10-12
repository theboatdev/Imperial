import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import TradeAccountFaq from './TradeAccountFaq';
import TradeAccountForm from './TradeAccountForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('tradeAccountTitle'),
    description: t('tradeAccountDescription'),
  };
}

export default async function TradeAccountPage() {
  const t = await getTranslations('TradeAccount');
  const tCommon = await getTranslations('Common');

  const whyItems = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => t(`whyItems.${i}`));
  const docItems = [0, 1, 2, 3, 4].map((i) => t(`docItems.${i}`));
  const processItems = [0, 1, 2, 3, 4].map((i) => t(`processItems.${i}`));

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
              marginBottom: '44px',
            }}
            className="trade-account-header"
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
              <p style={{ fontSize: '15.5px', lineHeight: 1.8, color: 'var(--text)', margin: '0 0 14px', textAlign: 'justify', maxWidth: '54ch' }}>
                {t('quickAnswer')}
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 22px', maxWidth: '54ch' }}>
                {t('approvedNote')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a href="#apply" className="btn primary" style={{ textDecoration: 'none' }}>
                  {t('ctaApply')}
                </a>
                <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
                  {t('ctaSales')}
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
                src="/category-building-materials.webp"
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

          <section style={{ marginBottom: '40px' }}>
            <h2
              style={{
                color: 'var(--navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                fontSize: 'clamp(22px, 2.4vw, 28px)',
                margin: '0 0 16px',
              }}
            >
              {t('whyTitle')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {whyItems.map((item, i) => (
                <div
                  key={item}
                  style={{
                    padding: '16px',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-soft)',
                    boxShadow: 'var(--sh-track)',
                    fontSize: '13.5px',
                    lineHeight: 1.55,
                    color: 'var(--text)',
                    fontWeight: 500,
                  }}
                >
                  <span style={{ color: 'var(--faint)', fontSize: '11px', fontWeight: 700, marginRight: '6px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '16px',
              marginBottom: '44px',
            }}
            className="trade-account-split"
          >
            <section
              style={{
                padding: '22px 20px',
                background: 'linear-gradient(135deg, var(--slot) 0%, #fff 55%)',
                borderRadius: 'var(--r-panel)',
                border: '1px solid var(--line)',
              }}
            >
              <h2 style={{ color: 'var(--navy)', fontSize: '18px', margin: '0 0 14px' }}>{t('docsTitle')}</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {docItems.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: '10px', fontSize: '13.5px', lineHeight: 1.55, color: 'var(--text)' }}>
                    <span aria-hidden="true" style={{ color: 'var(--imperial-blue)', fontWeight: 700 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section
              style={{
                padding: '22px 20px',
                background: '#fff',
                borderRadius: 'var(--r-panel)',
                border: '1px solid var(--line)',
              }}
            >
              <h2 style={{ color: 'var(--navy)', fontSize: '18px', margin: '0 0 14px' }}>{t('processTitle')}</h2>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {processItems.map((item, i) => (
                  <li key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span
                      style={{
                        flexShrink: 0,
                        width: '24px',
                        height: '24px',
                        borderRadius: '7px',
                        background: 'rgba(9, 79, 168, 0.1)',
                        color: 'var(--imperial-blue)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--text)', paddingTop: '2px' }}>{item}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section id="apply" style={{ marginBottom: '52px', scrollMarginTop: '100px' }}>
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
              {t('applyTitle')}
            </h2>
            <TradeAccountForm />
          </section>

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
            <TradeAccountFaq />
          </section>

          <style>{`
            @media (max-width: 820px) {
              .trade-account-header { grid-template-columns: 1fr !important; }
              .trade-account-split { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
