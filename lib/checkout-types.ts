/**
 * Shared checkout / payment payload types (client ↔ API).
 */

export const CHECKOUT_STORAGE_KEY = 'imperial-checkout-payload';

export interface CheckoutLineItem {
  merchandiseId: string;
  quantity: number;
  title: string;
  variantTitle?: string;
  priceAmount: string;
  currencyCode: string;
}

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CheckoutShippingAddress {
  address1: string;
  address2?: string;
  city: string;
  /** UAE emirate slug or label (stored as province) */
  emirate: string;
  country?: string;
  zip?: string;
}

export interface CheckoutPayload {
  items: CheckoutLineItem[];
  customer: CheckoutCustomer;
  shipping: CheckoutShippingAddress;
  currencyCode: string;
  /** Major units total charged to N-Genius (subtotal + shipping) */
  amountMajor: number;
  locale?: string;
}

export const EMIRATE_LABELS: Record<string, string> = {
  'abu-dhabi': 'Abu Dhabi',
  dubai: 'Dubai',
  sharjah: 'Sharjah',
  ajman: 'Ajman',
  uaq: 'Umm Al Quwain',
  rak: 'Ras Al Khaimah',
  fujairah: 'Fujairah',
};

export function emirateLabel(emirate: string): string {
  return EMIRATE_LABELS[emirate] || emirate;
}

export function encodeCheckoutPayload(payload: CheckoutPayload): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeCheckoutPayload(encoded: string): CheckoutPayload | null {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf8');
    const data = JSON.parse(json) as CheckoutPayload;
    if (!data?.items?.length || !data.customer?.email) return null;
    return data;
  } catch {
    return null;
  }
}

/** Free shipping over 500 (same rule as cart page). */
export function shippingCostForSubtotal(subtotal: number): number {
  return subtotal > 500 || subtotal === 0 ? 0 : 35;
}

export function computeCheckoutTotals(items: CheckoutLineItem[]): {
  subtotal: number;
  shipping: number;
  total: number;
} {
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.priceAmount) * item.quantity,
    0
  );
  const shipping = shippingCostForSubtotal(subtotal);
  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping,
    total: Number((subtotal + shipping).toFixed(2)),
  };
}
