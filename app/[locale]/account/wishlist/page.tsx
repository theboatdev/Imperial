import { getWishlist } from '@/app/actions/wishlist';
import { getAllProducts } from '@/lib/shopify-api';
import WishlistGrid, { WishlistCountBadge } from '@/components/account/WishlistGrid';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WishlistPage() {
  const t = await getTranslations('Account');
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(
    cookieStore.get('customer_access_token')?.value || cookieStore.get('customer_id_token')?.value
  );

  if (!isLoggedIn) {
    redirect('/api/auth/login');
  }

  const itemIds = await getWishlist();
  const { products: allProducts } = await getAllProducts({ first: 250 });
  const serverWishlistedProducts = allProducts.filter((p) =>
    itemIds.includes(p.id) || itemIds.some((id) => p.id.endsWith('/' + id) || id.endsWith('/' + p.id))
  );

  return (
    <div className="store-frame" style={{ padding: '40px 28px 64px', minHeight: '70vh' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ padding: '0 0 20px' }}>
        <Link href="/">{t('home')}</Link> / <Link href="/account">{t('customerAccount')}</Link> / <span>{t('wishlist')}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', borderBottom: '1px solid var(--line)', paddingBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--imperial-blue)', fontWeight: 700 }}>
            {t('savedProducts')}
          </div>
          <h1 style={{ color: 'var(--navy)', fontSize: '28px', margin: '6px 0 4px' }}>
            {t('myWishlist')}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
            {t('wishlistSubtitle')}
          </p>
        </div>

        {isLoggedIn ? (
          <a href="/api/auth/logout" className="btn secondary" style={{ fontSize: '12px', padding: '9px 16px' }}>
            {t('signOut')}
          </a>
        ) : (
          <a href="/api/auth/login" className="btn primary" style={{ fontSize: '12px', padding: '9px 16px' }}>
            {t('signInToSync')}
          </a>
        )}
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: '240px', flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {isLoggedIn && (
              <Link
                href="/account"
                style={{
                  color: 'var(--text)',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-soft)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                {t('dashboard')}
              </Link>
            )}
            <Link
              href="/account/wishlist"
              style={{
                background: 'var(--navy)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 'var(--r-soft)',
                fontSize: '12.5px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{t('wishlist')}</span>
              <WishlistCountBadge
                initialCount={itemIds.length}
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}
              />
            </Link>
            {isLoggedIn && (
              <Link
                href="/account/orders"
                style={{
                  color: 'var(--text)',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-soft)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                {t('orderHistory')}
              </Link>
            )}
            <Link
              href="/rfq"
              style={{
                color: 'var(--text)',
                padding: '10px 14px',
                borderRadius: 'var(--r-soft)',
                fontSize: '12.5px',
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              {t('requestQuote')}
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: '320px' }}>
          <WishlistGrid initialProducts={serverWishlistedProducts} catalogProducts={allProducts} />
        </div>
      </div>
    </div>
  );
}
