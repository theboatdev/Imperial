'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function CheckoutCancelPage() {
  const t = useTranslations('Checkout');
  const tCart = useTranslations('Cart');

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCart('home')}</Link>
        {' / '}
        <Link href="/cart">{tCart('yourCart')}</Link>
        {' / '}
        <span>{t('cancelBreadcrumb')}</span>
      </div>

      <div className="store-frame" style={{ padding: '32px 28px 72px', minHeight: '50vh' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              background: '#fff',
              borderRadius: 'var(--r-card)',
              boxShadow: 'var(--sh-soft)',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px', color: 'var(--muted)' }}>✕</div>
            <h1 style={{ color: 'var(--navy)', fontSize: '22px', marginBottom: '10px' }}>{t('cancelTitle')}</h1>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '14px',
                lineHeight: 1.7,
                maxWidth: '520px',
                margin: '0 auto 24px',
              }}
            >
              {t('cancelMessage')}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/checkout" className="btn primary">
                {t('tryAgain')}
              </Link>
              <Link href="/cart" className="btn secondary">
                {t('backToCart')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
