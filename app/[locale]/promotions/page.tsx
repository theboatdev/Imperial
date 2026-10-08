import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Promotions | Imperial',
  description: 'View current promotions and special offers from Imperial Middle East.',
};

export default async function PromotionsPage() {
  const t = await getTranslations('Pages');
  const tCommon = await getTranslations('Common');

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCommon('home')}</Link> / {t('promotionsTitle')}
      </div>

      <div className="store-frame" style={{ padding: '60px 28px', minHeight: '50vh', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--navy)', marginBottom: '24px', fontSize: '32px' }}>
          {t('promotionsTitle')}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 40px' }}>
          {t('promotionsDesc')}
        </p>
        
        <Link href="/products" className="btn primary">
          {t('browseAllProducts')}
        </Link>
      </div>
    </>
  );
}
