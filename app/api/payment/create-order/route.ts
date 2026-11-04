import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/ngenius';
import {
  computeCheckoutTotals,
  encodeCheckoutPayload,
  type CheckoutPayload,
  type CheckoutLineItem,
  type CheckoutCustomer,
  type CheckoutShippingAddress,
} from '@/lib/checkout-types';

function siteOrigin(request: Request): string {
  // Prefer the live request origin so local stub redirects stay on localhost
  // even when NEXT_PUBLIC_SITE_URL points at staging/production.
  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  if (host) return `${proto}://${host}`;
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (envUrl) return envUrl;
  return 'http://localhost:3000';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateBody(body: unknown): CheckoutPayload | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body' };
  }

  const b = body as Record<string, unknown>;
  const items = b.items as CheckoutLineItem[] | undefined;
  const customer = b.customer as CheckoutCustomer | undefined;
  const shipping = b.shipping as CheckoutShippingAddress | undefined;
  const currencyCode =
    typeof b.currencyCode === 'string' && b.currencyCode
      ? b.currencyCode
      : 'AED';
  const locale = typeof b.locale === 'string' ? b.locale : 'en';

  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'Cart is empty' };
  }

  for (const item of items) {
    if (!item?.merchandiseId || !item.quantity || item.quantity < 1) {
      return { error: 'Invalid cart line item' };
    }
  }

  if (
    !customer?.firstName?.trim() ||
    !customer?.lastName?.trim() ||
    !customer?.email?.trim() ||
    !customer?.phone?.trim()
  ) {
    return { error: 'Contact details are required' };
  }

  if (!isValidEmail(customer.email.trim())) {
    return { error: 'Invalid email address' };
  }

  if (!shipping?.address1?.trim() || !shipping?.city?.trim() || !shipping?.emirate?.trim()) {
    return { error: 'Delivery address is incomplete' };
  }

  const { total } = computeCheckoutTotals(items);
  if (total <= 0) {
    return { error: 'Order total must be greater than zero' };
  }

  return {
    items,
    customer: {
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone.trim(),
    },
    shipping: {
      address1: shipping.address1.trim(),
      address2: shipping.address2?.trim() || '',
      city: shipping.city.trim(),
      emirate: shipping.emirate.trim(),
      country: shipping.country?.trim() || 'AE',
      zip: shipping.zip?.trim() || '',
    },
    currencyCode,
    amountMajor: total,
    locale,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = validateBody(body);

    if ('error' in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const payload = validated;
    const origin = siteOrigin(request);
    const locale = payload.locale || 'en';
    const redirectUrl = `${origin}/${locale}/checkout/success`;
    const cancelUrl = `${origin}/${locale}/checkout/cancel`;

    const checkoutPayload = encodeCheckoutPayload(payload);

    const order = await createOrder({
      amountMajor: payload.amountMajor,
      currencyCode: payload.currencyCode,
      email: payload.customer.email,
      redirectUrl,
      cancelUrl,
      merchantOrderReference: `imp-${Date.now()}`,
      checkoutPayload,
    });

    return NextResponse.json({
      paymentUrl: order.paymentUrl,
      orderRef: order.orderRef,
      stub: order.stub,
    });
  } catch (error) {
    console.error('[payment/create-order]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
