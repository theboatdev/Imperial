import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import RoofWaterproofingFaq from './RoofWaterproofingFaq';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('roofWaterproofingTitle'),
    description: t('roofWaterproofingDescription'),
  };
}

export default async function RoofWaterproofingPage() {
  const t = await getTranslations('RoofWaterproofing');
  const tCommon = await getTranslations('Common');

  const infoItems = [0, 1, 2, 3, 4].map((i) => t(`infoItems.${i}`));

  const related = [
    { href: '/products?collection=waterproofing', label: t('relatedWaterproofing') },
    { href: '/products?collection=sealent', label: t('relatedSealants') },
    { href: '/products', label: t('relatedConcrete') },
    { href: '/products', label: t('relatedTools') },
  ] as const;

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCommon('home')}</Link>
        {' / '}
        <span>{t('breadcrumb')}</span>
      </div>

      <div className="store-frame" style={{ padding: '32px 28px 72px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="kicker" style={{ marginBottom: '12px' }}>{t('kicker')}</div>
          <h1 style={{ color: 'var(--navy)', margin: '0 0 20px', fontSize: 'clamp(26px, 3vw, 34px)', lineHeight: 1.15 }}>
            {t('title')}
          </h1>

          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text)', margin: '0 0 28px' }}>
            {t('quickAnswer')}
          </p>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 12px' }}>{t('overviewTitle')}</h2>
            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>
              {t('overview')}
            </p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 14px' }}>{t('infoTitle')}</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text)', fontSize: '14.5px', lineHeight: 1.6 }}>
              {infoItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 14px' }}>{t('relatedTitle')}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {related.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="btn secondary"
                  style={{ textDecoration: 'none', fontSize: '12.5px' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 28px', padding: '16px 18px', background: 'var(--slot)', borderRadius: 'var(--r-soft)' }}>
            {t('uaeSupport')}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
            <Link href="/rfq" className="btn primary" style={{ textDecoration: 'none' }}>
              {t('ctaQuote')}
            </Link>
            <Link href="/story" className="btn secondary" style={{ textDecoration: 'none' }}>
              {t('ctaSupport')}
            </Link>
            <Link href="/rfq" className="hero-link" style={{ alignSelf: 'center' }}>
              {t('ctaSiteVisit')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <section>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 16px' }}>{t('faqTitle')}</h2>
            <RoofWaterproofingFaq />
          </section>
        </div>
      </div>
    </>
  );
}
