import { NextResponse } from 'next/server';
import { getProductByHandle } from '@/lib/shopify-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('handles') || '';
  const handles = [...new Set(raw.split(',').map((h) => h.trim()).filter(Boolean))].slice(0, 6);

  if (handles.length === 0) {
    return NextResponse.json({ products: [] });
  }

  try {
    const results = await Promise.all(handles.map((handle) => getProductByHandle(handle)));
    const products = results.filter((p): p is NonNullable<typeof p> => p !== null);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products by handles API error:', error);
    return NextResponse.json({ products: [], error: 'Failed to load products' }, { status: 500 });
  }
}
