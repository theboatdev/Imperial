import { NextResponse } from 'next/server';
import { getOrderStatus } from '@/lib/ngenius';
import { createDraftOrder, hasCreatedDraftForPayment } from '@/lib/shopify-admin';
import {
  decodeCheckoutPayload,
  emirateLabel,
} from '@/lib/checkout-types';

/**
 * N-Genius webhook receiver.
 * Expects payment.completed (or equivalent) events with an order reference.
 * Creates a Shopify Draft Order when payment is confirmed and payload is available.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const eventName =
      (typeof body.eventName === 'string' && body.eventName) ||
      (typeof body.event === 'string' && body.event) ||
      '';

    const orderRef =
      (typeof body.orderReference === 'string' && body.orderReference) ||
      (typeof body.orderRef === 'string' && body.orderRef) ||
      (typeof body.reference === 'string' && body.reference) ||
      (typeof (body.order as { reference?: string } | undefined)?.reference === 'string'
        ? (body.order as { reference: string }).reference
        : '') ||
      '';

    // Acknowledge unknown / non-payment events quickly
    const isPaymentEvent =
      !eventName ||
      /payment\.(completed|captured|purchased)/i.test(eventName) ||
      /ORDER_PURCHASED|PURCHASED|CAPTURED/i.test(eventName);

    if (!orderRef) {
      console.warn('[payment/webhook] Missing order reference', { eventName });
      return NextResponse.json({ received: true, skipped: true, reason: 'no_order_ref' });
    }

    if (!isPaymentEvent) {
      return NextResponse.json({ received: true, skipped: true, reason: 'ignored_event' });
    }

    if (hasCreatedDraftForPayment(orderRef)) {
      return NextResponse.json({ received: true, duplicate: true, orderRef });
    }

    const status = await getOrderStatus(orderRef);
    if (!status.paid) {
      return NextResponse.json({
        received: true,
        skipped: true,
        reason: 'not_paid',
        status: status.status,
      });
    }

    const payload = status.checkoutPayload
      ? decodeCheckoutPayload(status.checkoutPayload)
      : null;

    if (!payload) {
      console.warn(
        '[payment/webhook] Paid order without checkout payload — cannot create draft order',
        orderRef
      );
      return NextResponse.json({
        received: true,
        skipped: true,
        reason: 'no_checkout_payload',
        orderRef,
      });
    }

    const draftOrder = await createDraftOrder(
      {
        lineItems: payload.items.map((item) => ({
          variantId: item.merchandiseId,
          quantity: item.quantity,
          title: item.title,
          price: item.priceAmount,
        })),
        email: payload.customer.email,
        phone: payload.customer.phone,
        shippingAddress: {
          firstName: payload.customer.firstName,
          lastName: payload.customer.lastName,
          address1: payload.shipping.address1,
          address2: payload.shipping.address2 || '',
          city: payload.shipping.city,
          province: emirateLabel(payload.shipping.emirate),
          country: payload.shipping.country || 'AE',
          zip: payload.shipping.zip || '',
          phone: payload.customer.phone,
        },
        note: `N-Genius ref: ${orderRef} (webhook)`,
        currencyCode: payload.currencyCode,
        tags: ['n-genius', 'headless-checkout', 'webhook', `ref:${orderRef}`],
      },
      orderRef
    );

    return NextResponse.json({
      received: true,
      orderRef,
      draftOrder: {
        id: draftOrder.id,
        name: draftOrder.name,
        stub: draftOrder.stub,
      },
    });
  } catch (error) {
    console.error('[payment/webhook]', error);
    // Return 200 where possible to avoid endless retries on malformed payloads;
    // still 500 for unexpected failures so N-Genius can retry.
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
