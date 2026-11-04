'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import {
  CHECKOUT_STORAGE_KEY,
  type CheckoutPayload,
} from '@/lib/checkout-types';

type VerifyState =
  | { phase: 'loading' }
  | { phase: 'success'; orderName: string; stub: boolean }
  | { phase: 'error'; message: string };

function SuccessContent() {
  const t = useTranslations('Checkout');
  const tCart = useTranslations('Cart');
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [state, setState] = useState<VerifyState>({ phase: 'loading' });

  useEffect(() => {
    const ref =
      searchParams.get('ref') ||
      searchParams.get('orderRef') ||
      searchParams.get('reference') ||
      '';

    let cancelled = false;

    async function verify() {
      if (!ref) {
        if (!cancelled) {
          setState({ phase: 'error', message: t('missingRef') });
        }
        return;
      }

      let checkoutPayload: CheckoutPayload | string | undefined;
      try {
        const keyed = sessionStorage.getItem(`${CHECKOUT_STORAGE_KEY}:${ref}`);
        const generic = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
        const raw = keyed || generic;
        if (raw) checkoutPayload = JSON.parse(raw) as CheckoutPayload;
      } catch {
        // ignore storage parse errors
      }

      try {
        const res = await fetch('/api/payment/verify-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderRef: ref, checkoutPayload }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          paid?: boolean;
          stub?: boolean;
          error?: string;
          draftOrder?: { name?: string; stub?: boolean };
        };

        if (!res.ok || !data.ok) {
          throw new Error(data.error || t('verifyError'));
        }

        clearCart();
        try {
          sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
          sessionStorage.removeItem(`${CHECKOUT_STORAGE_KEY}:${ref}`);
        } catch {
          // ignore
        }

        if (!cancelled) {
          setState({
            phase: 'success',
            orderName: data.draftOrder?.name || ref,
            stub: Boolean(data.stub || data.draftOrder?.stub),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            phase: 'error',
            message: err instanceof Error ? err.message : t('verifyError'),
          });
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart, t]);

  if (state.phase === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: 'var(--muted)' }}>{t('verifying')}</p>
      </div>
    );
  }

  if (state.phase === 'error') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: '#fff',
          borderRadius: 'var(--r-card)',
          boxShadow: 'var(--sh-soft)',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px', color: 'var(--signal-red)' }}>!</div>
        <h1 style={{ color: 'var(--navy)', fontSize: '22px', marginBottom: '10px' }}>{t('verifyFailedTitle')}</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
          {state.message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/cart" className="btn primary">
            {t('backToCart')}
          </Link>
          <Link href="/contact-us" className="btn secondary">
            {t('contactSupport')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        background: '#fff',
        borderRadius: 'var(--r-card)',
        boxShadow: 'var(--sh-soft)',
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '12px', color: 'var(--uae-green)' }}>✓</div>
      <h1 style={{ color: 'var(--navy)', fontSize: '22px', marginBottom: '10px' }}>{t('successTitle')}</h1>
      <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 12px' }}>
        {t('successMessage', { order: state.orderName })}
      </p>
      {state.stub && (
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '24px' }}>{t('stubNote')}</p>
      )}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
        <Link href="/products" className="btn primary">
          {tCart('continueShopping')}
        </Link>
        <Link href="/" className="btn secondary">
          {tCart('home')}
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const t = useTranslations('Checkout');
  const tCart = useTranslations('Cart');

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCart('home')}</Link>
        {' / '}
        <span>{t('successBreadcrumb')}</span>
      </div>
      <div className="store-frame" style={{ padding: '32px 28px 72px', minHeight: '50vh' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Suspense
            fallback={
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)' }}>
                {t('verifying')}
              </div>
            }
          >
            <SuccessContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
