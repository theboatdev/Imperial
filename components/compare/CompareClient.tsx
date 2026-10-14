'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { ShopifyProduct } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';
import { useCompareStore } from '@/lib/compare-store';
import { addLineItemAction } from '@/app/actions/cart';
import CompareTable from './CompareTable';

export default function CompareClient() {
  const t = useTranslations('Compare');
  const [mounted, setMounted] = useState(false);
  const products = useCompareStore((s) => s.products);
  const removeProduct = useCompareStore((s) => s.removeProduct);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const cartId = useCartStore((s) => s.cartId);
  const syncFromApi = useCartStore((s) => s.syncFromApi);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.variants[0];
    if (!variant) return;

    addItem({
      merchandiseId: variant.id,
      quantity: 1,
      title: product.title,
      variantTitle: variant.title,
      price: variant.price,
      image: product.images[0] ? { url: product.images[0].url, altText: product.images[0].altText } : null,
      handle: product.handle,
    });
    openCart();

    try {
      const updatedCart = await addLineItemAction(cartId, variant.id, 1);
      if (updatedCart?.id) {
        const localCount = useCartStore.getState().items.length;
        if (updatedCart.lines.length >= localCount) {
          syncFromApi(updatedCart.lines, updatedCart.id, updatedCart.checkoutUrl);
        } else {
          useCartStore.setState({ cartId: updatedCart.id, checkoutUrl: updatedCart.checkoutUrl });
        }
      }
    } catch {
      useCartStore.getState().removeItem(variant.id);
    }
  };

  if (!mounted) {
    return <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>{t('loading')}</div>;
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <p>{t('empty')}</p>
        <Link href="/products" className="btn block" style={{ maxWidth: '240px', margin: '20px auto' }}>
          {t('browseProducts')}
        </Link>
      </div>
    );
  }

  return (
    <CompareTable
      products={products}
      onRemove={removeProduct}
      showCartActions
      onAddToCart={handleAddToCart}
    />
  );
}
