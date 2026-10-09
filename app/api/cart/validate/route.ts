import { NextResponse } from 'next/server';
import { getCart, updateCartBuyerCountry } from '@/lib/shopify-api';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cartId = url.searchParams.get('cartId');

  if (!cartId) {
    return NextResponse.json({ error: 'Missing cartId' }, { status: 400 });
  }

  try {
    // Prefer AE market so existing carts (e.g. geo-detected LKR) reprice in AED
    let cart = null;
    try {
      cart = await updateCartBuyerCountry(cartId, { countryCode: 'AE' });
    } catch {
      cart = await getCart(cartId);
    }

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found or expired' }, { status: 404 });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Cart validation error:', error);
    return NextResponse.json({ error: 'Failed to validate cart' }, { status: 500 });
  }
}
