'use client';

import { useState, useEffect } from 'react';
import { useVatStore } from './vat-store';
import { formatPrice } from './utils';
import type { Money } from './types';

/**
 * A React hook that returns formatted price strings based on the global VAT toggle.
 * It assumes the base price provided from Shopify is VAT Inclusive.
 * Currency label comes from Shopify's money.currencyCode (AED fallback only if missing).
 */
export function usePrice() {
  const { isVatInclusive, vatRate } = useVatStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatWithVat = (money: Money) => {
    const baseAmount = parseFloat(money.amount);
    const currencyCode = money.currencyCode || 'AED';

    // To prevent hydration mismatches, default to the inclusive price before mounting
    if (!mounted) {
      return formatPrice({ amount: money.amount, currencyCode });
    }

    // If Shopify prices are inclusive of VAT, and the user wants EXCLUSIVE, we divide by (1 + vatRate)
    // If Shopify prices are inclusive of VAT, and user wants INCLUSIVE, we do nothing to the base.
    const finalAmount = isVatInclusive ? baseAmount : baseAmount / (1 + vatRate);

    return formatPrice({ amount: String(finalAmount), currencyCode });
  };

  return { formatWithVat, isVatInclusive, vatRate };
}

/**
 * Helper to check if a product price is unknown (0 or undefined).
 */
export function isUnknownPrice(money?: Money | null): boolean {
  if (!money) return true;
  const val = parseFloat(money.amount);
  return isNaN(val) || val === 0 || val === 1;
}
