'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useVatStore } from '@/lib/vat-store';
import type { ShopifyCollection, ShopifyProduct } from '@/lib/types';
import { usePrice } from '@/lib/use-price';
import LanguageSwitcher from './LanguageSwitcher';

type MegaMenuKey = 'collections' | 'brands' | 'about' | null;

interface Props {
  collections: ShopifyCollection[];
  vendors?: string[];
}

export default function HeaderClient({ collections, vendors = [] }: Props) {
  const t = useTranslations('Nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [openMenu, setOpenMenu] = useState<MegaMenuKey>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const { formatWithVat } = usePrice();
  const totalQuantity = useCartStore((s) => s.totalQuantity());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistCount = mounted ? wishlistItems.length : 0;
  
  const isVatInclusive = useVatStore((s) => s.isVatInclusive);
  const setVatInclusive = useVatStore((s) => s.setVatInclusive);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const headerRef = useRef<HTMLElement>(null);

  const hasCollection = Boolean(searchParams.get('collection'));
  const hasVendor = Boolean(searchParams.get('vendor'));
  const isProductsPath = pathname === '/products' || pathname.startsWith('/products/');

  const navActive = {
    products: isProductsPath && !hasCollection && !hasVendor,
    brands: isProductsPath && hasVendor,
    categories: pathname === '/categories' || pathname.startsWith('/categories/') || (isProductsPath && hasCollection),
    about: pathname === '/company' || pathname.startsWith('/company/'),
    promotions: pathname === '/promotions' || pathname.startsWith('/promotions/'),
    calculator: pathname === '/coverage-calculator' || pathname.startsWith('/coverage-calculator/'),
    bulk: pathname === '/bulk-inquiries' || pathname.startsWith('/bulk-inquiries/'),
    rfq: pathname === '/rfq' || pathname.startsWith('/rfq/'),
  };

  useEffect(() => { setMounted(true); }, []);

  // Close menu and suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setMobileSearchOpen(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch search suggestions with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search suggestion error', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close menu and suggestions on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setShowSuggestions(false);
    setSearchQuery('');
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setOpenMenu(null);
      setMobileSearchOpen(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const displayQuantity = mounted ? totalQuantity : 0;

  // Split collections into two columns for the mega menu
  const half = Math.ceil(collections.length / 2);
  const col1 = collections.slice(0, half);
  const col2 = collections.slice(half);

  // Split vendors into two columns for the mega menu
  const halfVendors = Math.ceil(vendors.length / 2);
  const brandCol1 = vendors.slice(0, halfVendors);
  const brandCol2 = vendors.slice(halfVendors);

  return (
    <header className="header" ref={headerRef}>
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-left">
          <span>{t('freeDelivery')}</span>
          <span className="topbar-email">info@imperial.ae</span>
        </div>
        <div className="topbar-right">
          <div className="segment on-dark">
            <button 
              className={isVatInclusive ? 'active' : ''} 
              type="button" 
              onClick={() => setVatInclusive(true)}
            >
              {t('incVat')}
            </button>
            <button 
              className={!isVatInclusive ? 'active' : ''} 
              type="button" 
              onClick={() => setVatInclusive(false)}
            >
              {t('exVat')}
            </button>
          </div>
          <div className="topbar-language">
            <Suspense fallback={<span className="lang-switcher">EN / AR</span>}>
              <LanguageSwitcher />
            </Suspense>
          </div>
          <div className="topbar-currency currency">
            <select aria-label={t('currency')}>
              <option>AED</option>
              <option>USD</option>
              <option>EUR</option>
              <option>SAR</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Main header row ── */}
      <div className="headerrow" style={{ position: 'relative' }}>
        <Link href="/" className="logo header-logo" aria-label={t('homeAria')}>
          <Image
            src="/logo.png"
            alt={t('logoAlt')}
            width={160}
            height={50}
            priority
            style={{ objectFit: 'contain', height: '50px', width: 'auto', borderRadius: '8px' }}
          />
        </Link>

        <div style={{ position: 'relative', flex: 1, minWidth: '240px', margin: '0 24px' }}>
          <form className={`searchbar ${mobileSearchOpen ? 'mobile-open' : ''}`} onSubmit={handleSearch} role="search" style={{ margin: 0, width: '100%' }}>
            <input
              type="search"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) setShowSuggestions(true);
              }}
              aria-label={t('searchAria')}
            />
            <button type="submit" aria-label={t('search')}>
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7"/>
                <path d="m16.5 16.5 4.5 4.5"/>
              </svg>
              {t('search')}
            </button>
          </form>

          {showSuggestions && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
              background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 100, border: '1px solid var(--line)', maxHeight: '400px', overflowY: 'auto'
            }}>
              {isSearching ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>{t('searching')}</div>
              ) : suggestions.length > 0 ? (
                <div>
                  {suggestions.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.handle}`}
                      onClick={() => setShowSuggestions(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                        borderBottom: '1px solid var(--line)', textDecoration: 'none', color: 'var(--text)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slot)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {prod.images?.[0] && (
                        <div style={{ width: '40px', height: '40px', position: 'relative', flexShrink: 0, background: 'var(--slot)', borderRadius: '4px' }}>
                          <Image src={prod.images[0].url} alt={prod.title} fill style={{ objectFit: 'contain', padding: '4px' }} sizes="40px" />
                        </div>
                      )}
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{prod.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                          {formatWithVat(prod.variants?.[0]?.price ?? prod.priceRange.minVariantPrice)}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div style={{ padding: '8px' }}>
                    <Link href={`/products?q=${encodeURIComponent(searchQuery)}`} onClick={() => setShowSuggestions(false)} style={{ display: 'block', textAlign: 'center', padding: '8px', background: 'var(--slot)', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--imperial-blue)', textDecoration: 'none' }}>
                      {t('viewAllResults')}
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>{t('noProductsFound')}</div>
              )}
            </div>
          )}
        </div>

        <div className="headericons">
          <button
            className="header-mobile-toggle header-mobile-search-toggle"
            type="button"
            onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false); }}
            aria-label={t('toggleSearch')}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div className="box">
              <svg className="ic lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4.5 4.5" />
              </svg>
            </div>
          </button>
          
          <Link href="/compare" className="icon" aria-label={t('compare')}>
            <div className="box">
              <svg className="ic lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="m16 3 4 4-4 4"/>
                <path d="M20 7H4"/>
                <path d="m8 21-4-4 4-4"/>
                <path d="M4 17h16"/>
              </svg>
            </div>
            <span>{t('compare')}</span>
          </Link>
          
          <Link href="/account/wishlist" prefetch={false} className="icon" aria-label={t('wishlistAria', { count: wishlistCount })}>
            <div className="box">
              <svg className={`ic lg ${wishlistCount > 0 ? 'fill' : ''}`} viewBox="0 0 24 24" fill={wishlistCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75">
                <path d="M12 20.2C9.5 18 4.5 14.4 4.5 10.6A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7.5 2.2c0 3.8-5 7.4-7.5 9.6Z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="badge pop">{wishlistCount}</span>
              )}
            </div>
            <span>{t('wishlist')}</span>
          </Link>

          <Link href="/account" prefetch={false} className="icon" aria-label={t('account')}>
            <div className="box">
              <svg className="ic lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="8.5" r="3.5"/>
                <path d="M5.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/>
              </svg>
            </div>
            <span>{t('account')}</span>
          </Link>

          <Link
            href="/cart"
            className="icon"
            aria-label={t('cartAria', { count: displayQuantity })}
            id="cart-toggle"
          >
            <div className="box">
              <svg className="ic lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M3 4h2.5l2 11h11l2-8H6.5"/>
                <circle cx="9" cy="19" r="1.5"/>
                <circle cx="17" cy="19" r="1.5"/>
              </svg>
              {mounted && totalQuantity > 0 && (
                <span className="badge pop">{totalQuantity}</span>
              )}
            </div>
            <span>{t('cart')}</span>
          </Link>

          <button
            className="header-mobile-toggle"
            type="button"
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileSearchOpen(false); }}
            aria-label={t('toggleMenu')}
            aria-expanded={mobileMenuOpen}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div className="box">
              <svg className="ic lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="17" x2="20" y2="17" /></>
                }
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* ── Mega Menu Nav ── */}
      <nav className="megabar" aria-label={t('mainNav')}>
        {/* All Products — simple link */}
        <Link
          href="/products"
          className={`megaitem megaitem-link${navActive.products ? ' active' : ''}`}
          aria-current={navActive.products ? 'page' : undefined}
        >
          {t('allProducts')}
        </Link>

        {/* Brands dropdown */}
        {vendors.length > 0 && (
          <div
            className={`megaitem${navActive.brands ? ' active' : ''}`}
            onMouseEnter={() => setOpenMenu('brands')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              className="megaitem-btn"
              aria-expanded={openMenu === 'brands'}
              aria-haspopup="true"
              aria-current={navActive.brands ? 'page' : undefined}
              onClick={() => setOpenMenu(openMenu === 'brands' ? null : 'brands')}
            >
              {t('brands')}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
                style={{ marginLeft: '4px', transition: 'transform 0.2s', transform: openMenu === 'brands' ? 'rotate(180deg)' : 'none' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openMenu === 'brands' && (
              <div className="megapanel" role="menu">
                {brandCol1.length > 0 && (
                  <div className="megacol">
                    {brandCol1.map((vendor) => (
                      <Link
                        key={vendor}
                        href={`/products?vendor=${encodeURIComponent(vendor)}`}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                      >
                        {vendor}
                      </Link>
                    ))}
                  </div>
                )}
                {brandCol2.length > 0 && (
                  <div className="megacol">
                    {brandCol2.map((vendor) => (
                      <Link
                        key={vendor}
                        href={`/products?vendor=${encodeURIComponent(vendor)}`}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                      >
                        {vendor}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Collections dropdown — real data */}
        {collections.length > 0 && (
          <div
            className={`megaitem${navActive.categories ? ' active' : ''}`}
            onMouseEnter={() => setOpenMenu('collections')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              className="megaitem-btn"
              aria-expanded={openMenu === 'collections'}
              aria-haspopup="true"
              aria-current={navActive.categories ? 'page' : undefined}
              onClick={() => setOpenMenu(openMenu === 'collections' ? null : 'collections')}
            >
              {t('categories')}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
                style={{ marginLeft: '4px', transition: 'transform 0.2s', transform: openMenu === 'collections' ? 'rotate(180deg)' : 'none' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openMenu === 'collections' && (
              <div className="megapanel" role="menu">
                {col1.length > 0 && (
                  <div className="megacol">
                    {col1.map((col) => (
                      <Link
                        key={col.id}
                        href={`/products?collection=${col.handle}`}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                      >
                        {col.title}
                      </Link>
                    ))}
                  </div>
                )}
                {col2.length > 0 && (
                  <div className="megacol">
                    {col2.map((col) => (
                      <Link
                        key={col.id}
                        href={`/products?collection=${col.handle}`}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                      >
                        {col.title}
                      </Link>
                    ))}
                  </div>
                )}
                <div className="megacol megacol-cta">
                  <Link href="/categories" className="megacol-view-all" onClick={() => setOpenMenu(null)}>
                    {t('viewAllCategories')}
                  </Link>
                  <Link href="/bulk-inquiries" className="megacol-rfq" onClick={() => setOpenMenu(null)}>
                    {t('bulkInquiries')}
                  </Link>
                  <Link href="/rfq" className="megacol-rfq" onClick={() => setOpenMenu(null)} style={{ marginTop: '10px' }}>
                    {t('requestQuote')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* About Us dropdown */}
        <div
          className={`megaitem${navActive.about ? ' active' : ''}`}
          onMouseEnter={() => setOpenMenu('about')}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            type="button"
            className="megaitem-btn"
            aria-expanded={openMenu === 'about'}
            aria-haspopup="true"
            aria-current={navActive.about ? 'page' : undefined}
            onClick={() => setOpenMenu(openMenu === 'about' ? null : 'about')}
          >
            {t('aboutUs')}
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
              style={{ marginLeft: '4px', transition: 'transform 0.2s', transform: openMenu === 'about' ? 'rotate(180deg)' : 'none' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {openMenu === 'about' && (
            <div className="megapanel" role="menu" style={{ minWidth: '220px', padding: '16px 20px' }}>
              <div className="megacol" style={{ minWidth: '100%' }}>
                <Link href="/company" role="menuitem" onClick={() => setOpenMenu(null)}>{t('theCompany')}</Link>
                <Link href="#" role="menuitem" onClick={() => setOpenMenu(null)}>{t('whyImperial')}</Link>
                <Link href="#" role="menuitem" onClick={() => setOpenMenu(null)}>{t('ourProjects')}</Link>
                <Link href="#" role="menuitem" onClick={() => setOpenMenu(null)}>{t('testimonials')}</Link>
                <Link href="#" role="menuitem" onClick={() => setOpenMenu(null)}>{t('awards')}</Link>
                <Link href="#" role="menuitem" onClick={() => setOpenMenu(null)}>{t('socialMedia')}</Link>
                <Link href="#" role="menuitem" onClick={() => setOpenMenu(null)}>{t('blog')}</Link>
                <Link href="#" role="menuitem" onClick={() => setOpenMenu(null)}>{t('getCredit')}</Link>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/promotions"
          className={`megaitem megaitem-link${navActive.promotions ? ' active' : ''}`}
          style={{ color: 'var(--signal-red)', fontWeight: 700 }}
          aria-current={navActive.promotions ? 'page' : undefined}
        >
          {t('promotions')}
        </Link>
        <Link
          href="/coverage-calculator"
          className={`megaitem megaitem-link${navActive.calculator ? ' active' : ''}`}
          aria-current={navActive.calculator ? 'page' : undefined}
        >
          {t('coverageCalculator')}
        </Link>
        <Link
          href="/bulk-inquiries"
          className={`megaitem megaitem-link highlight${navActive.bulk ? ' active' : ''}`}
          aria-current={navActive.bulk ? 'page' : undefined}
        >
          {t('bulkInquiries')}
        </Link>
        <Link
          href="/rfq"
          className={`megaitem megaitem-link highlight${navActive.rfq ? ' active' : ''}`}
          aria-current={navActive.rfq ? 'page' : undefined}
        >
          {t('requestQuote')}
        </Link>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <nav className="mobile-nav" aria-label={t('mobileNav')}>
          <Link
            href="/products"
            className={`mobile-nav-link${navActive.products ? ' active' : ''}`}
            aria-current={navActive.products ? 'page' : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('allProducts')}
          </Link>
          <Link
            href="/coverage-calculator"
            className={`mobile-nav-link${navActive.calculator ? ' active' : ''}`}
            aria-current={navActive.calculator ? 'page' : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('coverageCalculator')}
          </Link>
          <Link
            href="/promotions"
            className={`mobile-nav-link${navActive.promotions ? ' active' : ''}`}
            aria-current={navActive.promotions ? 'page' : undefined}
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--signal-red)', fontWeight: 700 }}
          >
            {t('promotions')}
          </Link>
          <div className={`mobile-nav-section${navActive.brands ? ' active' : ''}`}>{t('brands')}</div>
          {vendors.slice(0, 8).map((vendor) => {
            const isVendorActive = hasVendor && searchParams.get('vendor') === vendor;
            return (
              <Link
                key={vendor}
                href={`/products?vendor=${encodeURIComponent(vendor)}`}
                className={`mobile-nav-link${isVendorActive ? ' active' : ''}`}
                aria-current={isVendorActive ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {vendor}
              </Link>
            );
          })}
          <div className={`mobile-nav-section${navActive.categories ? ' active' : ''}`}>{t('categories')}</div>
          {collections.slice(0, 8).map((col) => {
            const isColActive = hasCollection && searchParams.get('collection') === col.handle;
            return (
              <Link
                key={col.id}
                href={`/products?collection=${col.handle}`}
                className={`mobile-nav-link${isColActive ? ' active' : ''}`}
                aria-current={isColActive ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {col.title}
              </Link>
            );
          })}
          {collections.length > 8 && (
            <Link
              href="/categories"
              className={`mobile-nav-link${pathname === '/categories' ? ' active' : ''}`}
              aria-current={pathname === '/categories' ? 'page' : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('allCategories')}
            </Link>
          )}
          <div className={`mobile-nav-section${navActive.about ? ' active' : ''}`}>{t('aboutUs')}</div>
          <Link
            href="/company"
            className={`mobile-nav-link${navActive.about ? ' active' : ''}`}
            aria-current={navActive.about ? 'page' : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('theCompany')}
          </Link>
          <Link href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('whyImperial')}</Link>
          <Link href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('ourProjects')}</Link>
          <Link href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('testimonials')}</Link>
          <Link href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('awards')}</Link>
          <Link href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('socialMedia')}</Link>
          <Link href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('blog')}</Link>
          <Link href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('getCredit')}</Link>

          <div className="mobile-nav-section" style={{ marginTop: '8px' }}>{t('action')}</div>
          <Link
            href="/bulk-inquiries"
            className={`mobile-nav-link mobile-nav-link-cta${navActive.bulk ? ' active' : ''}`}
            aria-current={navActive.bulk ? 'page' : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('bulkInquiries')}
          </Link>
          <Link
            href="/rfq"
            className={`mobile-nav-link mobile-nav-link-cta${navActive.rfq ? ' active' : ''}`}
            aria-current={navActive.rfq ? 'page' : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('requestQuote')}
          </Link>
        </nav>
      )}
    </header>
  );
}
