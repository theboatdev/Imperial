import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getCollections } from '@/lib/shopify-api';
import type { ShopifyCollection } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse Imperial product categories. Construction chemicals, building materials, tools and more.',
};

/** Local category images in public/collections — distinct from home page category art */
const COLLECTION_IMAGES: Record<string, string> = {
  waterproofing: '/collections/waterproofing.webp',
  adhesive: '/collections/adhesive.webp',
  adhesives: '/collections/adhesive.webp',
  sealent: '/collections/sealent.webp',
  sealant: '/collections/sealent.webp',
  sealants: '/collections/sealent.webp',
  bonding: '/collections/bonding.webp',
};

function resolveCollectionImage(collection: ShopifyCollection): string | null {
  const local = COLLECTION_IMAGES[collection.handle.toLowerCase()];
  if (local) return local;
  return collection.image?.url ?? null;
}

export default async function CollectionsPage() {
  const t = await getTranslations('Pages');
  const tCommon = await getTranslations('Common');
  let collections: ShopifyCollection[] = [];

  try {
    collections = await getCollections(20);
  } catch (error) {
    console.error('Error fetching collections:', error);
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCommon('home')}</Link> / {t('allCategories')}
      </div>
      <div className="section">
        <h2>{t('allCategories')}</h2>

        {collections.length > 0 ? (
          <div className="catgrid">
            {collections.map((collection) => {
              const imageSrc = resolveCollectionImage(collection);

              return (
                <Link
                  key={collection.id}
                  href={`/products?collection=${collection.handle}`}
                  className="cattile"
                >
                  <div style={{ height: '100px', position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-ctrl)', marginBottom: '10px', background: 'var(--chrome)' }}>
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={collection.image?.altText || collection.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '28px' }}>📦</span>
                    )}
                  </div>
                  <span>{collection.title}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="error-page" style={{ minHeight: '40vh' }}>
            <h2>{t('noCollections')}</h2>
            <p>{t('noCollectionsDesc')}</p>
          </div>
        )}
      </div>
    </>
  );
}
