import { NextResponse } from 'next/server';
import { getOrderStatus } from '@/lib/ngenius';
import { createDraftOrder } from '@/lib/shopify-admin';
import {
  decodeCheckoutPayload,
  emirateLabel,
  type CheckoutPayload,
} from '@/lib/checkout-types';

function buildDraftInput(payload: CheckoutPayload, orderRef: string) {
  const { customer, shipping, items, currencyCode } = payload;
  return {
    lineItems: items.map((item) => ({
      variantId: item.merchandiseId,
      quantity: item.quantity,
      title: item.title,
      price: item.priceAmount,
    })),
    email: customer.email,
    phone: customer.phone,
    shippingAddress: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      address1: shipping.address1,
      address2: shipping.address2 || '',
      city: shipping.city,
      province: emirateLabel(shipping.emirate),
      country: shipping.country || 'AE',
      zip: shipping.zip || '',
      phone: customer.phone,
    },
    note: `N-Genius ref: ${orderRef}`,
    currencyCode,
    tags: ['n-genius', 'headless-checkout', `ref:${orderRef}`],
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderRef?: string;
      checkoutPayload?: string | CheckoutPayload;
    };

    const orderRef = body.orderRef?.trim();
    if (!orderRef) {
      return NextResponse.json({ error: 'Missing orderRef' }, { status: 400 });
    }

    const status = await getOrderStatus(orderRef);

    if (!status.paid) {
      return NextResponse.json(
        {
          ok: false,
          paid: false,
          status: status.status,
          error: 'Payment not confirmed',
        },
        { status: 402 }
      );
    }

    let payload: CheckoutPayload | null = null;

    if (typeof body.checkoutPayload === 'string') {
      payload = decodeCheckoutPayload(body.checkoutPayload);
    } else if (body.checkoutPayload && typeof body.checkoutPayload === 'object') {
      payload = body.checkoutPayload as CheckoutPayload;
    } else if (status.checkoutPayload) {
      payload = decodeCheckoutPayload(status.checkoutPayload);
    }

    if (!payload) {
      // Stub / success without cart replay: still acknowledge payment
      if (status.stub) {
        const stubDraft = await createDraftOrder(
          {
            lineItems: [
              {
                variantId: '',
                quantity: 1,
                title: 'Stub checkout item',
                price: '0.00',
              },
            ],
            email: 'stub@example.com',
            shippingAddress: {
              firstName: 'Stub',
              lastName: 'Customer',
              address1: 'Mussafah',
              city: 'Abu Dhabi',
              province: 'Abu Dhabi',
              country: 'AE',
            },
            note: `N-Genius ref: ${orderRef} (stub — no checkout payload)`,
          },
          orderRef
        );

        return NextResponse.json({
          ok: true,
          paid: true,
          stub: true,
          status: status.status,
          draftOrder: stubDraft,
        });
      }

      return NextResponse.json(
        { error: 'Missing checkout payload for draft order', paid: true, status: status.status },
        { status: 400 }
      );
    }

    const draftOrder = await createDraftOrder(buildDraftInput(payload, orderRef), orderRef);

    return NextResponse.json({
      ok: true,
      paid: true,
      stub: status.stub || draftOrder.stub,
      status: status.status,
      draftOrder: {
        id: draftOrder.id,
        name: draftOrder.name,
        invoiceUrl: draftOrder.invoiceUrl,
        stub: draftOrder.stub,
      },
    });
  } catch (error) {
    console.error('[payment/verify-order]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
