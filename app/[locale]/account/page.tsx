import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getCustomerAccountData } from '@/lib/shopify-customer';
import { getWishlist } from '@/app/actions/wishlist';
import { getAllProducts } from '@/lib/shopify-api';
import WishlistGrid, { WishlistCountBadge } from '@/components/account/WishlistGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ERROR_MESSAGES: Record<string, string> = {
  token_failed: 'Authentication failed. Please try signing in again.',
  server_error: 'An unexpected error occurred during sign-in. Please try again.',
  invalid_state: 'Your sign-in session expired. Please try again.',
  no_code: 'Authorization was not completed. Please try signing in again.',
  auth_failed: 'We could not verify your identity. Please try again.',
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; auth?: string }>;
}) {
  const t = await getTranslations('Account');
  const params = await searchParams;
  const { isLoggedIn, customer } = await getCustomerAccountData();

  // If there's an auth error, show the error page instead of redirecting to login
  // (which would cause a redirect loop)
  if ((!isLoggedIn || !customer) && params.error) {
    return (
      <div className="store-frame" style={{ padding: '40px 28px 64px', minHeight: '70vh' }}>
        <div className="breadcrumb" style={{ padding: '0 0 20px' }}>
          <Link href="/">{t('home')}</Link> / <span>{t('customerAccount')}</span>
        </div>
        <div style={{
          maxWidth: '480px',
          margin: '60px auto',
          textAlign: 'center',
          background: '#fff',
          borderRadius: 'var(--r-card)',
          boxShadow: 'var(--sh-soft)',
          padding: '40px 32px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{ fontSize: '20px', color: 'var(--navy)', margin: '0 0 12px' }}>
            {t('signInIssue')}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
            {ERROR_MESSAGES[params.error] || 'An unknown error occurred. Please try again.'}
          </p>
          <a href="/api/auth/login" className="btn primary" style={{ marginRight: '12px' }}>
            {t('tryAgain')}
          </a>
          <Link href="/" className="btn secondary">
            {t('goHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !customer) {
    if (params.auth === 'success') {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>{t('sessionMissing')}</h2>
          <p>The OAuth flow succeeded, but your browser dropped the secure cookies, or Shopify failed to return profile data.</p>
          <p>Please check if third-party cookies are blocked, or clear your cache.</p>
          <a href="/api/auth/login" className="btn primary">{t('tryAgain')}</a>
        </div>
      );
    }
    redirect('/api/auth/login');
  }

  const wishlistIds = await getWishlist();
  const { products: allProducts } = await getAllProducts({ first: 250 });
  const wishlistedProducts = allProducts.filter((p) =>
    wishlistIds.includes(p.id) || wishlistIds.some((id) => p.id.endsWith('/' + id) || id.endsWith('/' + p.id))
  );

  const orders = customer.orders || [];

  return (
    <div className="store-frame" style={{ padding: '40px 28px 64px', minHeight: '70vh' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ padding: '0 0 20px' }}>
        <Link href="/">{t('home')}</Link> / <span>{t('customerAccount')}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', borderBottom: '1px solid var(--line)', paddingBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--imperial-blue)', fontWeight: 700 }}>
            {t('customerPortal')}
          </div>
          <h1 style={{ color: 'var(--navy)', fontSize: '28px', margin: '6px 0 4px' }}>
            {t('welcomeBack', { name: customer.displayName ?? '' })}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
            {customer.email || t('verifiedBuyer')}
          </p>
        </div>

        <a href="/api/auth/logout" className="btn secondary" style={{ fontSize: '12px', padding: '9px 16px' }}>
          {t('signOut')}
        </a>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: '240px', flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link
              href="/account"
              style={{
                background: 'var(--navy)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 'var(--r-soft)',
                fontSize: '12.5px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{t('dashboard')}</span>
            </Link>
            <Link
              href="/account/wishlist"
              style={{
                color: 'var(--text)',
                padding: '10px 14px',
                borderRadius: 'var(--r-soft)',
                fontSize: '12.5px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background var(--motion)'
              }}
            >
              <span>{t('wishlist')}</span>
              <WishlistCountBadge
                initialCount={wishlistIds.length}
                style={{ background: 'var(--slot)', color: 'var(--navy)', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}
              />
            </Link>
            <Link
              href="/account/orders"
              style={{
                color: 'var(--text)',
                padding: '10px 14px',
                borderRadius: 'var(--r-soft)',
                fontSize: '12.5px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{t('orderHistory')}</span>
              {orders.length > 0 && (
                <span style={{ background: 'var(--slot)', color: 'var(--navy)', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                  {orders.length}
                </span>
              )}
            </Link>
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

        {/* Main Content Area */}
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em' }}>
                {t('accountEmail')}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginTop: '8px', wordBreak: 'break-all' }}>
                {customer.email || t('verifiedBuyer')}
              </div>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em' }}>
                {t('savedInWishlist')}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--navy)', marginTop: '4px' }}>
                <WishlistCountBadge initialCount={wishlistIds.length} showZero={true} />
              </div>
              <Link href="/account/wishlist" style={{ fontSize: '11.5px', color: 'var(--imperial-blue)', fontWeight: 600, textDecoration: 'none' }}>
                {t('viewWishlist')}
              </Link>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em' }}>
                {t('ordersPlaced')}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--navy)', marginTop: '4px' }}>
                {orders.length}
              </div>
              <Link href="/account/orders" style={{ fontSize: '11.5px', color: 'var(--imperial-blue)', fontWeight: 600, textDecoration: 'none' }}>
                {t('viewOrders')}
              </Link>
            </div>
          </div>

          {/* Default Address Section */}
          {customer.defaultAddress && (
            <div style={{ background: '#fff', padding: '22px', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--navy)', margin: '0 0 12px' }}>
                {t('deliveryAddress')}
              </h3>
              <p style={{ color: 'var(--text)', fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}>
                {customer.defaultAddress.formatted?.join(', ') || [
                  customer.defaultAddress.address1,
                  customer.defaultAddress.city,
                  customer.defaultAddress.country
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          )}

          {/* Recent Orders Section */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--navy)', margin: 0, fontWeight: 700 }}>
                {t('recentOrders')}
              </h3>
              {orders.length > 0 && (
                <Link href="/account/orders" style={{ fontSize: '12px', color: 'var(--imperial-blue)', textDecoration: 'none', fontWeight: 600 }}>
                  {t('viewAll', { count: orders.length })}
                </Link>
              )}
            </div>

            {orders.length === 0 ? (
              <div style={{ padding: '24px 0', color: 'var(--muted)', fontSize: '13.5px' }}>
                <p style={{ margin: '0 0 14px' }}>{t('noOrders')}</p>
                <Link href="/products" className="btn primary" style={{ fontSize: '12px', padding: '10px 18px' }}>
                  {t('startShopping')}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--slot)', borderRadius: 'var(--r-soft)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--navy)' }}>
                        {order.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                        {new Date(order.processedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--navy)' }}>
                        {order.totalPrice ? `${order.totalPrice.amount} ${order.totalPrice.currencyCode}` : '—'}
                      </div>
                      <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '6px', background: '#eef8f2', color: 'var(--uae-green)', marginTop: '4px' }}>
                        {order.fulfillmentStatus || order.financialStatus || t('confirmed')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Preview */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '15px', color: 'var(--navy)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{t('wishlist')}</span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>
                    (<WishlistCountBadge initialCount={wishlistIds.length} showZero={true} />)
                  </span>
                </h3>
                <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                  {t('wishlistPreview')}
                </span>
              </div>
              <Link href="/account/wishlist" style={{ fontSize: '12px', color: 'var(--imperial-blue)', textDecoration: 'none', fontWeight: 600 }}>
                {t('manageAll')}
              </Link>
            </div>

            <WishlistGrid
              initialProducts={wishlistedProducts}
              catalogProducts={allProducts}
              maxItems={4}
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
