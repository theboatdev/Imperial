import type { Metadata } from 'next';
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

      <div className="store-frame" style={{ padding: '32px 28px 72px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="kicker" style={{ marginBottom: '12px' }}>{t('kicker')}</div>
          <h1 style={{ color: 'var(--navy)', margin: '0 0 20px', fontSize: 'clamp(26px, 3vw, 34px)', lineHeight: 1.15 }}>
            {t('title')}
          </h1>

          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text)', margin: '0 0 16px' }}>
            {t('quickAnswer')}
          </p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 36px', padding: '16px 18px', background: 'var(--slot)', borderRadius: 'var(--r-soft)' }}>
            {t('consolidatedNote')}
          </p>

          <section style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {EMIRATE_KEYS.map((key) => (
              <article
                key={key}
                style={{
                  borderBottom: '1px solid var(--line)',
                  paddingBottom: '20px',
                }}
              >
                <h2 style={{ color: 'var(--navy)', fontSize: '18px', margin: '0 0 8px' }}>
                  {t(`emirates.${key}.name`)}
                </h2>
                <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
                  {t(`emirates.${key}.body`)}
                </p>
              </article>
            ))}
          </section>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
            <Link href="/uae-project-supply" className="btn primary" style={{ textDecoration: 'none' }}>
              {t('ctaPricing')}
            </Link>
            <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
              {t('ctaContact')}
            </Link>
          </div>

          <section>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 16px' }}>{t('faqTitle')}</h2>
            <UaeServiceAreasFaq />
          </section>
        </div>
      </div>
    </>
  );
}
