import type { Metadata } from 'next';
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

      <div className="store-frame" style={{ padding: '32px 28px 72px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="kicker" style={{ marginBottom: '12px' }}>{t('kicker')}</div>
          <h1 style={{ color: 'var(--navy)', margin: '0 0 20px', fontSize: 'clamp(26px, 3vw, 34px)', lineHeight: 1.15 }}>
            {t('title')}
          </h1>

          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text)', margin: '0 0 16px' }}>
            {t('quickAnswer')}
          </p>
          <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 32px' }}>
            {t('searchNote')}
          </p>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 14px' }}>{t('supportTitle')}</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text)', fontSize: '14.5px', lineHeight: 1.65 }}>
              {supportItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 14px' }}>{t('libraryTitle')}</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 14px' }}>
              {t('libraryIntro')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {libraryLabels.map((label) => (
                <span
                  key={label}
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    background: 'var(--slot)',
                    borderRadius: 'var(--r-soft)',
                    border: '1px solid var(--line)',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </section>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
            <Link href="/products" className="btn primary" style={{ textDecoration: 'none' }}>
              {t('ctaSearch')}
            </Link>
            <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
              {t('ctaSupport')}
            </Link>
            <Link href="/rfq" className="hero-link" style={{ alignSelf: 'center' }}>
              {t('ctaUpload')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <section>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 16px' }}>{t('faqTitle')}</h2>
            <TechnicalResourcesFaq />
          </section>
        </div>
      </div>
    </>
  );
}
