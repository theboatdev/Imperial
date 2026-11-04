'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { useVatStore } from '@/lib/vat-store';
import { formatPrice } from '@/lib/utils';
import {
  CHECKOUT_STORAGE_KEY,
  shippingCostForSubtotal,
  type CheckoutPayload,
} from '@/lib/checkout-types';

const EMIRATES = [
  'abu-dhabi',
  'dubai',
  'sharjah',
  'ajman',
  'uaq',
  'rak',
  'fujairah',
] as const;

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const tForms = useTranslations('Forms');
  const tCart = useTranslations('Cart');
  const locale = useLocale();
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const subtotalStr = useCartStore((s) => s.subtotal());
  const currencyCode = useCartStore((s) => s.currency());
  const closeCart = useCartStore((s) => s.closeCart);
  const { vatRate } = useVatStore();

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [emirate, setEmirate] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    setMounted(true);
    closeCart();
  }, [closeCart]);

  const subtotalNum = parseFloat(subtotalStr) || 0;
  const shippingCost = shippingCostForSubtotal(subtotalNum);
  const vatAmount = subtotalNum * vatRate;
  const grandTotal = subtotalNum + shippingCost;

  const lineItems = useMemo(
    () =>
      items.map((item) => ({
        merchandiseId: item.merchandiseId,
        quantity: item.quantity,
        title: item.title,
        variantTitle: item.variantTitle,
        priceAmount: item.price.amount,
        currencyCode: item.price.currencyCode || currencyCode,
      })),
    [items, currencyCode]
  );

  if (!mounted) {
    return (
      <div className="cartwrap" style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--muted)' }}>{t('loading')}</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <div className="breadcrumb">
          <Link href="/">{tCart('home')}</Link> / <span>{t('breadcrumb')}</span>
        </div>
        <div className="store-frame" style={{ padding: '48px 28px', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--navy)', fontSize: '24px', marginBottom: '12px' }}>{t('emptyTitle')}</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>{t('emptyDescription')}</p>
          <Link href="/products" className="btn primary">
            {tCart('browseProducts')}
          </Link>
        </div>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: CheckoutPayload = {
      items: lineItems,
      customer: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
      shipping: {
        address1: address1.trim(),
        address2: address2.trim(),
        city: city.trim(),
        emirate,
        country: 'AE',
        zip: zip.trim(),
      },
      currencyCode,
      amountMajor: grandTotal,
      locale,
    };

    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(payload));
      }

      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        paymentUrl?: string;
        orderRef?: string;
        error?: string;
        stub?: boolean;
      };

      if (!res.ok || !data.paymentUrl) {
        throw new Error(data.error || t('createOrderError'));
      }

      if (data.orderRef && typeof window !== 'undefined') {
        sessionStorage.setItem(
          `${CHECKOUT_STORAGE_KEY}:${data.orderRef}`,
          JSON.stringify(payload)
        );
      }

      const url = data.paymentUrl;
      if (url.startsWith('/') || url.includes(window.location.host)) {
        // Local stub or same-origin success URL — keep locale via next-intl router when relative
        try {
          const parsed = new URL(url, window.location.origin);
          const path = parsed.pathname.replace(/^\/(en|ar|zh|ru)/, '') || '/';
          router.push(`${path}${parsed.search}`);
        } catch {
          window.location.href = url;
        }
      } else {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('createOrderError'));
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCart('home')}</Link>
        {' / '}
        <Link href="/cart">{tCart('yourCart')}</Link>
        {' / '}
        <span>{t('breadcrumb')}</span>
      </div>

      <div className="cartwrap">
        <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 0 }} aria-label={t('formAria')}>
          <h1 style={{ color: 'var(--navy)', fontSize: 'clamp(22px, 2.8vw, 28px)', margin: '0 0 8px' }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.65, marginBottom: '28px' }}>
            {t('subtitle')}
          </p>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.13em', color: 'var(--navy)', marginBottom: '16px' }}>
              {t('contactHeading')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="formrow">
                <label htmlFor="checkout-first-name">{t('firstName')}</label>
                <input
                  id="checkout-first-name"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="formrow">
                <label htmlFor="checkout-last-name">{t('lastName')}</label>
                <input
                  id="checkout-last-name"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="formrow">
                <label htmlFor="checkout-email">{t('email')}</label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="formrow">
                <label htmlFor="checkout-phone">{t('phone')}</label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder={t('phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.13em', color: 'var(--navy)', marginBottom: '16px' }}>
              {t('addressHeading')}
            </h2>
            <div className="formrow">
              <label htmlFor="checkout-address1">{t('address1')}</label>
              <input
                id="checkout-address1"
                name="address1"
                type="text"
                required
                autoComplete="address-line1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </div>
            <div className="formrow">
              <label htmlFor="checkout-address2">{t('address2')}</label>
              <input
                id="checkout-address2"
                name="address2"
                type="text"
                autoComplete="address-line2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div className="formrow">
                <label htmlFor="checkout-city">{t('city')}</label>
                <input
                  id="checkout-city"
                  name="city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="formrow">
                <label htmlFor="checkout-emirate">{t('emirate')}</label>
                <select
                  id="checkout-emirate"
                  name="emirate"
                  className="softselect"
                  style={{ width: '100%', height: '48px' }}
                  required
                  value={emirate}
                  onChange={(e) => setEmirate(e.target.value)}
                >
                  <option value="" disabled>
                    {t('selectEmirate')}
                  </option>
                  {EMIRATES.map((key) => {
                    const formKey =
                      key === 'abu-dhabi'
                        ? 'abuDhabi'
                        : key;
                    return (
                      <option key={key} value={key}>
                        {tForms(`emirates.${formKey}`)}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="formrow">
                <label htmlFor="checkout-zip">{t('zip')}</label>
                <input
                  id="checkout-zip"
                  name="zip"
                  type="text"
                  autoComplete="postal-code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>
          </section>

          {error && (
            <p role="alert" style={{ color: 'var(--signal-red)', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn primary block"
            disabled={submitting}
            id="pay-securely-button"
          >
            {submitting ? t('processing') : t('paySecurely')}
            {!submitting && (
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
          </button>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '12px', lineHeight: 1.55 }}>
            {t('secureNote')}
          </p>
        </form>

        <aside className="summary">
          <h4>{tCart('orderSummary')}</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
            {items.map((item) => (
              <div key={item.merchandiseId} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div
                  className="ph"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 'var(--r-soft)',
                    background: 'var(--slot)',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {item.image?.url ? (
                    <Image
                      src={item.image.url}
                      alt={item.image.altText || item.title}
                      fill
                      sizes="52px"
                      style={{ objectFit: 'contain', padding: 4 }}
                    />
                  ) : null}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {item.variantTitle !== 'Default Title' ? item.variantTitle : tCart('standard')}
                    {' · '}
                    {tCart('qty', { count: item.quantity })}
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatPrice({
                    amount: (parseFloat(item.price.amount) * item.quantity).toString(),
                    currencyCode: item.price.currencyCode || currencyCode,
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="sumrow">
            <span>{tCart('subtotal')}</span>
            <span>{formatPrice({ amount: subtotalNum.toString(), currencyCode })}</span>
          </div>
          <div className="sumrow">
            <span>{tCart('shipping')}</span>
            <span>
              {shippingCost === 0
                ? tCart('free')
                : formatPrice({ amount: shippingCost.toString(), currencyCode })}
            </span>
          </div>
          <div className="sumrow">
            <span>{tCart('vat', { rate: Math.round(vatRate * 100) })}</span>
            <span>{formatPrice({ amount: vatAmount.toString(), currencyCode })}</span>
          </div>
          <div className="sumrow total">
            <span>{tCart('total')}</span>
            <span>{formatPrice({ amount: grandTotal.toString(), currencyCode })}</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.55, marginTop: '14px' }}>
            {tCart('vatNote')}
          </p>
        </aside>
      </div>
    </>
  );
}
