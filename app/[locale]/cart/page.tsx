'use client';

import { useCartStore } from '@/lib/cart-store';
import { useVatStore } from '@/lib/vat-store';
import { formatPrice, isValidCheckoutUrl } from '@/lib/utils';
import { updateLineItemAction, removeLineItemAction } from '@/app/actions/cart';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo, type SyntheticEvent } from 'react';
import type { ShopifyProduct } from '@/lib/types';
import CompareTable from '@/components/compare/CompareTable';

export default function CartPage() {
  const t = useTranslations('Cart');
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const cartId = useCartStore((s) => s.cartId);
  const checkoutUrl = useCartStore((s) => s.checkoutUrl);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const syncFromApi = useCartStore((s) => s.syncFromApi);
  const subtotalStr = useCartStore((s) => s.subtotal());
  const currencyCode = useCartStore((s) => s.currency());
  const subtotalNum = parseFloat(subtotalStr) || 0;

  const { vatRate } = useVatStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const [compareMode, setCompareMode] = useState(false);
  const [selectedHandles, setSelectedHandles] = useState<string[]>([]);
  const [compareProducts, setCompareProducts] = useState<ShopifyProduct[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const uniqueHandles = useMemo(
    () => [...new Set(items.map((item) => item.handle).filter(Boolean))],
    [items]
  );
  const canCompare = uniqueHandles.length >= 2;

  const compareModalOpen = compareProducts.length === 2;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Drop selections for products no longer in the cart
  useEffect(() => {
    setSelectedHandles((prev) => prev.filter((h) => uniqueHandles.includes(h)));
    setCompareProducts((prev) => {
      const next = prev.filter((p) => uniqueHandles.includes(p.handle));
      return next.length === prev.length ? prev : next;
    });
    if (uniqueHandles.length < 2) {
      setCompareMode(false);
      setCompareProducts([]);
      setSelectedHandles([]);
    }
  }, [uniqueHandles]);

  // Lock body scroll + Escape to close while compare modal is open
  useEffect(() => {
    if (!compareModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCompareProducts([]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [compareModalOpen]);

  const closeCompareModal = () => {
    setCompareProducts([]);
  };

  if (!mounted) {
    return (
      <div className="cartwrap" style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--muted)' }}>{t('loading')}</div>
      </div>
    );
  }

  const handleIncrement = async (merchandiseId: string, lineId: string, currentQty: number) => {
    if (isUpdating || !cartId || lineId.startsWith('temp-')) return;
    const newQty = currentQty + 1;
    setIsUpdating(true);
    updateQuantity(merchandiseId, newQty);
    try {
      const updatedCart = await updateLineItemAction(cartId, lineId, newQty);
      if (updatedCart.lines.length > 0) {
        syncFromApi(updatedCart.lines, updatedCart.id, updatedCart.checkoutUrl);
      }
    } catch {
      updateQuantity(merchandiseId, currentQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async (merchandiseId: string, lineId: string, currentQty: number) => {
    if (isUpdating || !cartId || lineId.startsWith('temp-')) return;
    const newQty = currentQty - 1;
    setIsUpdating(true);
    if (newQty <= 0) {
      removeItem(merchandiseId);
      try {
        const updatedCart = await removeLineItemAction(cartId, lineId);
        syncFromApi(updatedCart.lines, updatedCart.id, updatedCart.checkoutUrl);
      } catch {
        // Revert
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    updateQuantity(merchandiseId, newQty);
    try {
      const updatedCart = await updateLineItemAction(cartId, lineId, newQty);
      syncFromApi(updatedCart.lines, updatedCart.id, updatedCart.checkoutUrl);
    } catch {
      updateQuantity(merchandiseId, currentQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (merchandiseId: string, lineId: string) => {
    if (isUpdating || !cartId) return;
    setIsUpdating(true);
    removeItem(merchandiseId);
    try {
      const updatedCart = await removeLineItemAction(cartId, lineId);
      syncFromApi(updatedCart.lines, updatedCart.id, updatedCart.checkoutUrl);
    } catch {
      // Revert if error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckout = () => {
    if (checkoutUrl && isValidCheckoutUrl(checkoutUrl)) {
      window.location.href = checkoutUrl;
    }
  };

  const toggleSelect = (handle: string) => {
    setSelectedHandles((prev) => {
      if (prev.includes(handle)) {
        return prev.filter((h) => h !== handle);
      }
      if (prev.length >= 2) return prev;
      return [...prev, handle];
    });
    setCompareError(null);
  };

  const startCompareMode = () => {
    setCompareMode(true);
    setSelectedHandles([]);
    setCompareProducts([]);
    setCompareError(null);
  };

  const cancelCompareMode = () => {
    setCompareMode(false);
    setSelectedHandles([]);
    setCompareProducts([]);
    setCompareError(null);
  };

  const runCompare = async () => {
    if (selectedHandles.length !== 2) return;
    setCompareLoading(true);
    setCompareError(null);
    try {
      const res = await fetch(`/api/products/by-handles?handles=${encodeURIComponent(selectedHandles.join(','))}`);
      const data = await res.json();
      const products = (data.products || []) as ShopifyProduct[];
      if (products.length < 2) {
        setCompareError(t('compareLoadError'));
        setCompareProducts([]);
      } else {
        // Preserve selection order
        const ordered = selectedHandles
          .map((h) => products.find((p) => p.handle === h))
          .filter((p): p is ShopifyProduct => Boolean(p));
        setCompareProducts(ordered);
      }
    } catch {
      setCompareError(t('compareLoadError'));
      setCompareProducts([]);
    } finally {
      setCompareLoading(false);
    }
  };

  const shippingCost = subtotalNum > 500 || subtotalNum === 0 ? 0 : 35;
  const vatAmount = subtotalNum * vatRate;
  const grandTotal = subtotalNum + shippingCost;

  // One checkbox per unique product (first cart line for that handle)
  const seenHandles = new Set<string>();

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{t('home')}</Link> / <span>{t('yourCart')}</span>
      </div>

      <div className="cartwrap">
        <div className="cartitems">
          {items.length === 0 ? (
            <div style={{ background: '#fff', padding: '48px 24px', textAlign: 'center', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px', color: 'var(--silver)' }}>🛒</div>
              <h2 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '8px' }}>{t('emptyTitle')}</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>{t('emptyDescription')}</p>
              <Link href="/products" className="btn primary">
                {t('browseProducts')}
              </Link>
            </div>
          ) : (
            <>
              {canCompare && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '16px',
                    padding: '14px 16px',
                    background: '#fff',
                    borderRadius: 'var(--r-card)',
                    boxShadow: 'var(--sh-soft)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--navy)' }}>{t('compareCartTitle')}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                      {compareMode ? t('compareCartHint') : t('compareCartIntro')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {!compareMode ? (
                      <button type="button" className="btn primary" style={{ padding: '10px 16px' }} onClick={startCompareMode}>
                        {t('compareItems')}
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn primary"
                          style={{ padding: '10px 16px' }}
                          onClick={runCompare}
                          disabled={selectedHandles.length !== 2 || compareLoading}
                        >
                          {compareLoading ? t('compareLoading') : t('compareSelected')}
                        </button>
                        <button type="button" className="btn secondary" style={{ padding: '10px 16px' }} onClick={cancelCompareMode}>
                          {t('compareCancel')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {items.map((item) => {
                const itemTotal = parseFloat(item.price.amount) * item.quantity;
                const isFirstOfHandle = !seenHandles.has(item.handle);
                if (isFirstOfHandle) seenHandles.add(item.handle);
                const isSelected = selectedHandles.includes(item.handle);
                const selectionFull = selectedHandles.length >= 2 && !isSelected;

                const stop = (e: SyntheticEvent) => e.stopPropagation();

                return (
                  <div
                    key={item.id}
                    className="cartline"
                    role={compareMode ? 'button' : undefined}
                    tabIndex={compareMode ? 0 : undefined}
                    aria-pressed={compareMode ? isSelected : undefined}
                    aria-label={compareMode ? t('compareSelectAria', { title: item.title }) : undefined}
                    onClick={
                      compareMode
                        ? () => {
                            if (!selectionFull || isSelected) toggleSelect(item.handle);
                          }
                        : undefined
                    }
                    onKeyDown={
                      compareMode
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (!selectionFull || isSelected) toggleSelect(item.handle);
                            }
                          }
                        : undefined
                    }
                    style={{
                      ...(compareMode
                        ? {
                            cursor: selectionFull ? 'not-allowed' : 'pointer',
                            outline: isSelected ? '2px solid var(--imperial-blue)' : '1px solid transparent',
                            outlineOffset: '-1px',
                            background: isSelected ? 'rgba(9, 79, 168, 0.04)' : undefined,
                          }
                        : {}),
                    }}
                  >
                    {compareMode && (
                      <span
                        className="check"
                        style={{
                          flexShrink: 0,
                          margin: 0,
                          padding: '0 4px 0 0',
                          pointerEvents: 'none',
                          opacity: isFirstOfHandle || isSelected ? 1 : 0.35,
                        }}
                        aria-hidden="true"
                      >
                        <input type="checkbox" checked={isSelected} readOnly tabIndex={-1} />
                        <span className="box">
                          <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      </span>
                    )}

                    <div className="ph cartline-img">
                      {item.image?.url ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.altText || item.title}
                          fill
                          sizes="76px"
                          style={{ objectFit: 'contain', padding: '6px' }}
                        />
                      ) : (
                        <svg className="ic lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                      )}
                    </div>

                    <div className="info">
                      <Link
                        href={`/products/${item.handle}`}
                        className="n"
                        style={{ color: 'var(--navy)', textDecoration: 'none' }}
                        onClick={stop}
                      >
                        {item.title}
                      </Link>
                      <div className="m">
                        {item.variantTitle !== 'Default Title' ? item.variantTitle : t('standard')} &middot; {t('qty', { count: item.quantity })}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }} onClick={stop}>
                        <div className="stepper" style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>
                          <button
                            type="button"
                            onClick={() => handleDecrement(item.merchandiseId, item.id, item.quantity)}
                            aria-label={t('decreaseQty')}
                          >
                            &minus;
                          </button>
                          <input value={item.quantity} readOnly aria-label={t('qty', { count: item.quantity })} />
                          <button
                            type="button"
                            onClick={() => handleIncrement(item.merchandiseId, item.id, item.quantity)}
                            aria-label={t('increaseQty')}
                          >
                            &#43;
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.merchandiseId, item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--signal-red)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </div>

                    <div className="price">
                      {formatPrice({ amount: itemTotal.toString(), currencyCode: item.price.currencyCode || currencyCode })}
                    </div>
                  </div>
                );
              })}

              {compareError && (
                <p style={{ color: 'var(--signal-red)', fontSize: '13px', marginTop: '12px' }}>{compareError}</p>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="summary">
            <h4>{t('orderSummary')}</h4>
            <div className="sumrow">
              <span>{t('subtotal')}</span>
              <span>{formatPrice({ amount: subtotalNum.toString(), currencyCode })}</span>
            </div>
            <div className="sumrow">
              <span>{t('shipping')}</span>
              <span>{shippingCost === 0 ? t('free') : formatPrice({ amount: shippingCost.toString(), currencyCode })}</span>
            </div>
            <div className="sumrow">
              <span>{t('vat', { rate: Math.round(vatRate * 100) })}</span>
              <span>{formatPrice({ amount: vatAmount.toString(), currencyCode })}</span>
            </div>
            <div className="sumrow total">
              <span>{t('total')}</span>
              <span>{formatPrice({ amount: grandTotal.toString(), currencyCode })}</span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.55, marginTop: '14px' }}>{t('vatNote')}</p>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.55, marginTop: '8px' }}>{t('stockNote')}</p>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.55, marginTop: '8px' }}>{t('deliveryNote')}</p>

            <button
              type="button"
              className="btn primary block"
              style={{ marginTop: '18px' }}
              onClick={handleCheckout}
            >
              {t('proceedToCheckout')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div style={{ marginTop: '16px', padding: '14px', background: 'var(--slot)', borderRadius: 'var(--r-soft)' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--navy)', marginBottom: '6px' }}>
                {t('convertToQuote')}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.55, marginBottom: '10px' }}>
                {t('convertToQuoteDesc')}
              </p>
              <Link href="/rfq" className="btn secondary block" style={{ textAlign: 'center' }}>
                {t('convertToQuote')}
              </Link>
            </div>
          </div>
        )}
      </div>

      {compareModalOpen && (
        <div
          className="cart-backdrop cart-backdrop-open"
          style={{ zIndex: 200 }}
          onClick={closeCompareModal}
          aria-hidden="true"
        />
      )}
      {compareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-compare-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 210,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              pointerEvents: 'auto',
              width: 'min(960px, 100%)',
              maxHeight: '90vh',
              overflow: 'auto',
              background: '#fff',
              borderRadius: 'var(--r-panel)',
              boxShadow: 'var(--sh-lift)',
              border: '1px solid var(--line)',
              padding: '22px 22px 18px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                position: 'sticky',
                top: 0,
                background: '#fff',
                zIndex: 1,
                paddingBottom: '8px',
              }}
            >
              <h3
                id="cart-compare-title"
                style={{ margin: 0, fontSize: '18px', color: 'var(--navy)', borderBottom: 'none', paddingBottom: 0 }}
              >
                {t('compareResultTitle')}
              </h3>
              <button
                type="button"
                className="btn secondary"
                style={{ padding: '8px 14px' }}
                onClick={closeCompareModal}
              >
                {t('compareClose')}
              </button>
            </div>
            <CompareTable products={compareProducts} />
          </div>
        </div>
      )}
    </>
  );
}
