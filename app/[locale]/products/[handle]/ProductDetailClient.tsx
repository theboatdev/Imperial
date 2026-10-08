'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ShopifyProduct } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';
import { useCompareStore } from '@/lib/compare-store';
import { addLineItemAction } from '@/app/actions/cart';
import { usePrice, isUnknownPrice } from '@/lib/use-price';
import { getProductCoverageInfo } from '@/lib/coverage';

export default function ProductDetailClient({ product }: { product: ShopifyProduct }) {
  const t = useTranslations('Products');
  const router = useRouter();
  const { formatWithVat, isVatInclusive } = usePrice();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '');
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'docs' | 'reviews'>('desc');
  const [qty, setQty] = useState(1);
  const [qtySource, setQtySource] = useState<'default' | 'calc' | 'manual'>('default');

  const addItem = useCartStore((s) => s.addItem);
  const cartId = useCartStore((s) => s.cartId);
  const syncFromApi = useCartStore((s) => s.syncFromApi);

  const compareProducts = useCompareStore((s) => s.products);
  const addCompare = useCompareStore((s) => s.addProduct);
  const removeCompare = useCompareStore((s) => s.removeProduct);
  const isCompared = compareProducts.some((p) => p.id === product.id);

  const toggleCompare = () => {
    if (isCompared) removeCompare(product.id);
    else addCompare(product);
  };

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const images = product.images;
  const activeImage = images[activeThumb];
  const isAvailable = selectedVariant?.availableForSale;

  // Product-specific coverage detection
  const coverageInfo = useMemo(() => getProductCoverageInfo(product), [product]);
  const [calcArea, setCalcArea] = useState('');
  const [calcRate, setCalcRate] = useState(coverageInfo.defaultRate);
  const [includeWastage, setIncludeWastage] = useState(true);

  const areaNum = parseFloat(calcArea);
  const rateNum = parseFloat(calcRate);
  const hasValidCalc = !isNaN(areaNum) && areaNum > 0 && !isNaN(rateNum) && rateNum > 0;
  const rawNeeded = hasValidCalc ? Math.ceil(areaNum / rateNum) : 0;
  const finalNeeded = hasValidCalc
    ? Math.ceil(includeWastage ? (areaNum / rateNum) * 1.1 : areaNum / rateNum)
    : 0;
  const unitLabel = finalNeeded === 1 ? coverageInfo.unitSingular : coverageInfo.unitPlural;

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Synchronize quantity automatically with area & coverage rate
  const syncQuantity = useCallback((areaStr: string, rateStr: string, wastage: boolean) => {
    const areaNum = parseFloat(areaStr);
    const rateNum = parseFloat(rateStr);
    if (!isNaN(areaNum) && areaNum > 0 && !isNaN(rateNum) && rateNum > 0) {
      const rawUnits = areaNum / rateNum;
      const finalUnits = wastage ? rawUnits * 1.10 : rawUnits;
      const needed = Math.max(1, Math.ceil(finalUnits));
      setQty(needed);
      setQtySource('calc');
    } else if (!areaStr || areaStr.trim() === '' || areaNum === 0) {
      setQty(1);
      setQtySource('default');
    }
  }, []);

  const handleAreaChange = (val: string) => {
    setCalcArea(val);
    syncQuantity(val, calcRate, includeWastage);
  };

  const handleRateChange = (val: string) => {
    setCalcRate(val);
    syncQuantity(calcArea, val, includeWastage);
  };

  const handleWastageToggle = () => {
    const next = !includeWastage;
    setIncludeWastage(next);
    syncQuantity(calcArea, calcRate, next);
  };

  const handleStepperChange = (newQty: number) => {
    setQty(Math.max(1, newQty));
    setQtySource('manual');
  };

  const handleAddToCart = useCallback(async () => {
    if (isAdding || !isAvailable) return;
    setIsAdding(true);
    addItem({
      merchandiseId: selectedVariant.id,
      quantity: qty,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      image: activeImage ? { url: activeImage.url, altText: activeImage.altText } : null,
      handle: product.handle,
    });
    setAdded(true);
    router.push('/cart');
    try {
      const updatedCart = await addLineItemAction(cartId, selectedVariant.id, qty);
      const localCount = useCartStore.getState().items.length;
      if (updatedCart.lines.length >= localCount) {
        syncFromApi(updatedCart.lines, updatedCart.id, updatedCart.checkoutUrl);
      } else {
        useCartStore.setState({ cartId: updatedCart.id, checkoutUrl: updatedCart.checkoutUrl });
      }
    } catch {
      useCartStore.getState().removeItem(selectedVariant.id);
    } finally {
      setIsAdding(false);
    }
  }, [isAdding, isAvailable, selectedVariant, qty, addItem, router, product, activeImage, cartId, syncFromApi]);

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">{t('home')}</Link> / <Link href="/products">{t('products')}</Link> / <span>{product.title}</span>
      </div>

      <div className="pdpwrap pdp-layout">
        {/* Gallery */}
        <div className="pdpgallery pdp-gallery">
          <div className="mainph pdp-gallery-main">
            {activeImage ? (
              <Image
                src={activeImage.url}
                alt={activeImage.altText || product.title}
                fill
                sizes="420px"
                style={{ objectFit: 'contain', padding: '16px' }}
                priority
              />
            ) : (
              <svg className="ic xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            )}
          </div>
          {images.length > 1 && (
            <div className="thumbrow pdp-thumbrow">
              {images.slice(0, 5).map((img, i) => (
                <div
                  key={img.url}
                  className={`th pdp-thumb ${i === activeThumb ? 'active' : ''}`}
                  onClick={() => setActiveThumb(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={t('viewImage', { n: i + 1 })}
                >
                  <Image src={img.url} alt={img.altText || `${product.title} ${i + 1}`} fill sizes="72px" style={{ objectFit: 'contain', padding: '4px' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pdpinfo pdp-info">
          {product.vendor && <div className="brand pdp-brand">{product.vendor}</div>}
          <h1 className="pdp-title">{product.title}</h1>
          <div className="sku pdp-sku">{t('sku', { sku: selectedVariant?.title || 'Standard' })}</div>

          {/* Price box */}
          <div className="pricebox pdp-pricebox">
            {isUnknownPrice(selectedVariant?.price ?? product.priceRange.minVariantPrice) ? (
              <div className="price pdp-price" style={{ color: 'var(--imperial-blue)' }}>{t('requestForQuote')}</div>
            ) : (
              <>
                <div className="price pdp-price">{formatWithVat(selectedVariant?.price ?? product.priceRange.minVariantPrice)}</div>
                <div className="vatnote pdp-vatnote">{isVatInclusive ? t('priceIncludesVat') : t('priceExcludesVat')}</div>
              </>
            )}
          </div>

          {/* Stock message */}
          {!isAvailable ? (
            <div className="stockmsg low pdp-stock-msg low">
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {t('outOfStockMessage')}
            </div>
          ) : product.totalInventory && product.totalInventory <= 10 ? (
            <div className="stockmsg low pdp-stock-msg low">
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {t('lowStockMessage', { count: product.totalInventory })}
            </div>
          ) : null}

          {/* Pack Size Swatches */}
          {product.variants.length > 1 && (
            <div className="field pdp-field">
              <label className="pdp-field-label">{t('packSize')}</label>
              <div className="swatches pdp-swatches">
                {product.variants.map((v) => (
                  <div
                    key={v.id}
                    className={`swatch pdp-swatch ${v.id === selectedVariantId ? 'active' : ''}`}
                    onClick={() => setSelectedVariantId(v.id)}
                    role="button"
                    tabIndex={0}
                    style={!v.availableForSale ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                  >
                    {v.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coverage Calculator */}
          <div className="field pdp-field">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="pdp-field-label" style={{ margin: 0 }}>{t('coverageCalculator')}</label>
              {coverageInfo.detectedKeyword && (
                <span style={{ fontSize: '10.5px', color: 'var(--muted)', background: 'var(--slot)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                  {coverageInfo.detectedKeyword}
                </span>
              )}
            </div>

            <div className="calcbox calc-box">
              <div className="row calc-row">
                <div className="cell calc-cell">
                  <label htmlFor="calc-area">{t('areaSqm')}</label>
                  <input
                    id="calc-area"
                    type="number"
                    placeholder={t('areaPlaceholder')}
                    value={calcArea}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    min="0"
                    step="any"
                  />
                </div>
                <div className="cell calc-cell">
                  <label htmlFor="calc-rate">{t('coverageRate')}</label>
                  <select id="calc-rate" value={calcRate} onChange={(e) => handleRateChange(e.target.value)}>
                    {coverageInfo.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Wastage allowance toggle */}
              <div className="calc-wastage-row" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="calc-wastage"
                  checked={includeWastage}
                  onChange={handleWastageToggle}
                  style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: 'var(--imperial-blue)' }}
                />
                <label htmlFor="calc-wastage" style={{ fontSize: '11.5px', color: 'var(--text)', cursor: 'pointer', userSelect: 'none' }}>
                  {t('wastageAllowance')}
                </label>
              </div>

              {/* Dynamic Result with auto-sync status */}
              <div className="result calc-result" style={{ transition: 'all var(--motion)' }}>
                {hasValidCalc ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--uae-green)', flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ color: 'var(--navy)', fontWeight: 600 }}>
                          <strong>{t('unitsRequired', { count: finalNeeded, unit: unitLabel, area: calcArea })}</strong>
                        </span>
                      </div>
                      <span className="calc-auto-badge">
                        {t('quantityUpdated', { count: finalNeeded })}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', paddingLeft: '22px' }}>
                      {t('coverageFormula', { area: calcArea, rate: calcRate, unit: coverageInfo.unitSingular })}
                      {includeWastage && (
                        <span> {t('wastageExtra', {
                          count: Math.max(0, finalNeeded - rawNeeded),
                          unit: finalNeeded - rawNeeded === 1 ? coverageInfo.unitSingular : coverageInfo.unitPlural,
                        })}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', width: '100%' }}>
                    <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span>{t('enterArea', { units: coverageInfo.unitPlural })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="field pdp-field">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <label className="pdp-field-label" style={{ margin: 0 }}>{t('quantity')}</label>
              {qtySource === 'calc' && hasValidCalc && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--imperial-blue)',
                  background: 'rgba(9, 79, 168, 0.08)',
                  border: '1px solid rgba(9, 79, 168, 0.18)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {t('autoSet', { area: calcArea, rate: calcRate, unit: coverageInfo.unitSingular })}
                </span>
              )}
              {qtySource === 'manual' && hasValidCalc && (
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  {t('manuallyAdjusted', {
                    qty,
                    unit: qty === 1 ? coverageInfo.unitSingular : coverageInfo.unitPlural,
                  })}
                </span>
              )}
            </div>

            <div className="stepper">
              <button onClick={() => handleStepperChange(qty - 1)} aria-label={t('quantity')}>
                <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <input
                value={qty}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) handleStepperChange(val);
                }}
                aria-label={t('quantity')}
              />
              <button onClick={() => handleStepperChange(qty + 1)} aria-label={t('quantity')}>
                <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          {/* CTA Row */}
          <div className="cta-row pdp-cta-row">
            {isUnknownPrice(selectedVariant?.price ?? product.priceRange.minVariantPrice) ? (
              <button
                className="btn primary block"
                onClick={() => router.push('/rfq')}
              >
                <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {t('requestQuote')}
              </button>
            ) : (
              <button
                className="btn primary block"
                onClick={handleAddToCart}
                disabled={!isAvailable || isAdding}
              >
                <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 4h2.5l2 11h11l2-8H6.5" />
                  <circle cx="9" cy="19" r="1.5" />
                  <circle cx="17" cy="19" r="1.5" />
                </svg>
                {isAdding ? t('adding') : added ? t('addedToCart') : isAvailable ? t('addToCart') : t('outOfStock')}
              </button>
            )}
            <Link href="/rfq" className="btn secondary">
              {t('negotiate')}
            </Link>
            <button
              className={`btn ${isCompared ? 'primary' : 'secondary'}`}
              onClick={toggleCompare}
              title={isCompared ? t('removeFromCompare') : t('addToCompare')}
            >
              {isCompared ? t('compared') : t('compare')}
            </button>
          </div>

          {/* Action grid */}
          <div className="actiongrid pdp-action-grid">
            <Link href="/rfq">
              <span className="aico">
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="txt">
                <span className="lbl">{t('sendInquiry')}</span>
                <span className="sub">{t('sendInquiryDesc')}</span>
              </span>
            </Link>
            <button type="button" onClick={() => alert('Product specialist chat widget')}>
              <span className="aico">
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </span>
              <span className="txt">
                <span className="lbl">{t('chatNow')}</span>
                <span className="sub">{t('chatNowDesc')}</span>
              </span>
            </button>
            <Link href="/rfq">
              <span className="aico">
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m4.93 4.93 14.14 14.14" />
                </svg>
              </span>
              <span className="txt">
                <span className="lbl">{t('negotiateLabel')}</span>
                <span className="sub">{t('negotiateDesc')}</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setActiveTab('docs');
                const tabsEl = document.querySelector('.tabs');
                tabsEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="aico">
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </span>
              <span className="txt">
                <span className="lbl">{t('technicalData')}</span>
                <span className="sub">{t('technicalDataDesc')}</span>
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs pdp-tabs" role="tablist">
            {(['desc', 'docs', 'reviews'] as const).map((tab) => (
              <div
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'desc' ? t('description') : tab === 'docs' ? t('documents') : t('reviews')}
              </div>
            ))}
          </div>

          {activeTab === 'desc' && (
            <div className="tabpanel pdp-tabpanel">
              {(() => {
                const desc = product.descriptionHtml || product.description || '';
                if (!desc) return t('descriptionFallback');
                
                const stripped = desc.replace(/<[^>]*>?/gm, '').trim();
                let isOnlyUrl = false;
                try {
                  new URL(stripped);
                  isOnlyUrl = stripped.startsWith('http');
                } catch {
                  // Not a valid URL
                }

                if (isOnlyUrl) {
                  return (
                    <div style={{ padding: '20px 0' }}>
                      <a href={stripped} target="_blank" rel="noopener noreferrer" className="btn secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        {t('viewTechnicalDoc')}
                      </a>
                    </div>
                  );
                }

                return <div dangerouslySetInnerHTML={{ __html: desc }} />;
              })()}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="tabpanel pdp-tabpanel">
              <p>Technical Data Sheet (PDF) &middot; Safety Data Sheet (PDF) &middot; Application Guide (PDF)</p>
              <p style={{ marginTop: '10px' }}>Contact <a href="mailto:info@imperial.ae" style={{ color: 'var(--imperial-blue)' }}>info@imperial.ae</a> to request manufacturer compliance test reports.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tabpanel pdp-tabpanel">
              <span className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="ic sm fill" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </span>
              <p style={{ marginTop: '8px' }}>“Used on our project in Al Quoz — reliable quality and consistent batch mix.” — Verified contractor</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
