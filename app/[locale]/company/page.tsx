import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('companyTitle'),
    description: t('companyDescription'),
  };
}

export default async function CompanyPage() {
  const t = await getTranslations('Pages');

  return (
    <div className="store-frame" style={{ padding: '40px 28px', minHeight: '60vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--navy)', marginBottom: '24px', fontSize: '32px' }}>{t('aboutTitle')}</h1>

        <div style={{ position: 'relative', width: '100%', height: '220px', marginBottom: '32px', borderRadius: 'var(--r-panel)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '24px', textAlign: 'center' }}>
            <span style={{ opacity: 0.9, fontSize: '15px', lineHeight: 1.6, maxWidth: '520px' }}>
              M45, Mussafah, Abu Dhabi · Serving all seven Emirates
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, color: 'var(--text)', fontSize: '15px' }}>
          <p>{t('aboutSummary')}</p>
          <p>{t('aboutRange')}</p>

          <h2 style={{ color: 'var(--navy)', marginTop: '16px', fontSize: '22px' }}>{t('missionTitle')}</h2>
          <p>{t('mission')}</p>

          <h2 style={{ color: 'var(--navy)', marginTop: '16px', fontSize: '22px' }}>{t('visionTitle')}</h2>
          <p>{t('vision')}</p>

          <h2 style={{ color: 'var(--navy)', marginTop: '16px', fontSize: '22px' }}>{t('companyValues')}</h2>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>{t('value1')}</li>
            <li>{t('value2')}</li>
            <li>{t('value3')}</li>
            <li>{t('value4')}</li>
            <li>{t('value5')}</li>
            <li>{t('value6')}</li>
          </ul>

          <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn primary">
              {t('browseCatalog')}
            </Link>
            <Link href="/rfq" className="btn secondary">
              {t('contactSales')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
