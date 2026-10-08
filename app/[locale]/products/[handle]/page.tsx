import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProductByHandle } from '@/lib/shopify-api';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { handle } = await params;
    const product = await getProductByHandle(handle);
    if (!product) {
      const t = await getTranslations('Products');
      return { title: t('products') };
    }
    return {
      title: product.title,
      description: product.description?.slice(0, 160),
      openGraph: {
        title: `${product.title} | IMPERIAL`,
        description: product.description?.slice(0, 160),
        images: product.images[0] ? [{ url: product.images[0].url }] : [],
      },
    };
  } catch {
    const t = await getTranslations('Products');
    return { title: t('products') };
  }
}

export default async function ProductPage({ params }: PageProps) {
  let product;
  try {
    const { handle } = await params;
    product = await getProductByHandle(handle);
  } catch {
    // Shopify not connected — show placeholder
    return <PlaceholderProduct />;
  }

  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images[0]?.url,
    offers: {
      '@type': 'Offer',
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient product={product} />
    </>
  );
}

async function PlaceholderProduct() {
  const t = await getTranslations('Products');
  return (
    <div className="error-page" style={{ minHeight: '50vh' }}>
      <h2 className="text-headline-lg">{t('connectStore')}</h2>
      <p>{t('connectStoreDesc')}</p>
    </div>
  );
}
