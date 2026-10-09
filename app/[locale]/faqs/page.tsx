import type { Metadata } from 'next';
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

      <div className="store-frame" style={{ padding: '32px 28px 72px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="kicker" style={{ marginBottom: '12px' }}>{t('kicker')}</div>
          <h1 style={{ color: 'var(--navy)', margin: '0 0 20px', fontSize: 'clamp(26px, 3vw, 34px)', lineHeight: 1.15 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text)', margin: '0 0 36px' }}>
            {t('intro')}
          </p>

          <FaqHubClient />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '48px' }}>
            <Link href="/rfq" className="btn primary" style={{ textDecoration: 'none' }}>
              {t('ctaQuote')}
            </Link>
            <Link href="/uae-project-supply" className="btn secondary" style={{ textDecoration: 'none' }}>
              {t('ctaProject')}
            </Link>
            <Link href="/contact-us" className="hero-link" style={{ alignSelf: 'center' }}>
              {t('ctaContact')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
