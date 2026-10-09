import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import DeliveryInfoFaq from './DeliveryInfoFaq';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('deliveryInfoTitle'),
    description: t('deliveryInfoDescription'),
  };
}

export default async function DeliveryInformationPage() {
  const t = await getTranslations('DeliveryInformation');
  const tCommon = await getTranslations('Common');

  const infoItems = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => t(`infoItems.${i}`));
  const acceptItems = [0, 1, 2, 3, 4].map((i) => t(`acceptItems.${i}`));

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
            {t('dependNote')}
          </p>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 14px' }}>{t('infoTitle')}</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text)', fontSize: '14.5px', lineHeight: 1.6 }}>
              {infoItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 14px' }}>{t('acceptTitle')}</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text)', fontSize: '14.5px', lineHeight: 1.6 }}>
              {acceptItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 28px', padding: '16px 18px', background: 'var(--slot)', borderRadius: 'var(--r-soft)' }}>
            {t('confirmNote')}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
            <Link href="/rfq" className="btn primary" style={{ textDecoration: 'none' }}>
              {t('ctaConfirm')}
            </Link>
            <Link href="/rfq" className="btn secondary" style={{ textDecoration: 'none' }}>
              {t('ctaUpload')}
            </Link>
            <Link href="/uae-service-areas" className="hero-link" style={{ alignSelf: 'center' }}>
              {t('ctaAreas')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <section>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 16px' }}>{t('faqTitle')}</h2>
            <DeliveryInfoFaq />
          </section>
        </div>
      </div>
    </>
  );
}
