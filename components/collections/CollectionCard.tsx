import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { ShopifyCollection } from '@/lib/types';

interface CollectionCardProps {
  collection: ShopifyCollection;
}

export default async function CollectionCard({ collection }: CollectionCardProps) {
  const t = await getTranslations('Home');

  return (
    <Link
      href={`/products?collection=${collection.handle}`}
      className="collection-card"
      id={`collection-${collection.handle}`}
    >
      <div className="collection-card-image">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="collection-card-img"
          />
        ) : (
          <div className="collection-card-placeholder">
            <span>{collection.title}</span>
          </div>
        )}
        <div className="collection-card-overlay">
          <div className="collection-card-content">
            <h3 className="collection-card-title">{collection.title}</h3>
            {collection.description && (
              <p className="collection-card-description">
                {collection.description.length > 120
                  ? `${collection.description.substring(0, 120)}...`
                  : collection.description}
              </p>
            )}
            <span className="collection-card-cta">{t('explore')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
