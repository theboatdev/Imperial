import { NextResponse } from 'next/server';
import { searchProductSuggestions } from '@/lib/shopify-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q?.trim()) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProductSuggestions(q, 6);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
