'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { ShopifyProduct } from '@/lib/types';
import { usePrice } from '@/lib/use-price';
import { formatPrice } from '@/lib/utils';

interface CompareTableProps {
  products: ShopifyProduct[];
  onRemove?: (id: string) => void;
  showCartActions?: boolean;
  onAddToCart?: (product: ShopifyProduct) => void;
}

export default function CompareTable({
  products,
  onRemove,
  showCartActions = false,
  onAddToCart,
}: CompareTableProps) {
  const t = useTranslations('Compare');
  const { formatWithVat, isVatInclusive, vatRate } = usePrice();

  if (products.length === 0) return null;

  return (
    <div className="compare-table-wrapper" style={{ overflowX: 'auto', paddingBottom: '20px' }}>
      <table className="compare-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: products.length > 2 ? '800px' : '560px' }}>
        <tbody>
          <tr>
            <td style={{ width: '160px', border: '1px solid var(--line)', padding: '16px' }} />
            {products.map((p) => {
              const basePrice = p.priceRange.minVariantPrice;
              const priceNum = parseFloat(basePrice.amount);
              const exclTaxAmount = priceNum / (1 + vatRate);
              const exclTaxStr = formatPrice({
                amount: String(exclTaxAmount),
                currencyCode: basePrice.currencyCode || 'AED',
              });

              return (
                <td
                  key={p.id}
                  style={{
                    border: '1px solid var(--line)',
                    padding: '24px',
                    verticalAlign: 'top',
                    position: 'relative',
                    width: products.length === 2 ? '50%' : '300px',
                  }}
                >
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--muted)',
                        fontSize: '18px',
                      }}
                      aria-label={t('removeFromCompare', { title: p.title })}
                    >
                      ×
                    </button>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        margin: '0 auto',
                        background: '#fff',
                        borderRadius: '4px',
                        border: '1px solid var(--chrome)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {p.images[0] ? (
                        <Image src={p.images[0].url} alt={p.title} fill style={{ objectFit: 'contain', padding: '8px' }} />
                      ) : (
                        <div style={{ color: 'var(--chrome)', fontSize: '40px' }}>□</div>
                      )}
                    </div>
                    <Link
                      href={`/products/${p.handle}`}
                      style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600, fontSize: '14px', lineHeight: 1.4 }}
                    >
                      {p.title}
                    </Link>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>{formatWithVat(basePrice)}</div>
                      {isVatInclusive && (
                        <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>{t('exclTax', { price: exclTaxStr })}</div>
                      )}
                    </div>
                    {showCartActions && onAddToCart && (
                      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <button
                          type="button"
                          className="btn primary"
                          style={{ flex: 1, padding: '10px 14px', fontSize: '11px', textTransform: 'uppercase' }}
                          onClick={() => onAddToCart(p)}
                        >
                          {t('addToCart')}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>

          <tr>
            <td style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
              {t('sku')}
            </td>
            {products.map((p) => (
              <td key={p.id} style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '13px', color: 'var(--text)' }}>
                {p.variants[0]?.id.split('/').pop()?.slice(0, 8) || t('na')}
              </td>
            ))}
          </tr>

          <tr>
            <td
              style={{
                border: '1px solid var(--line)',
                padding: '16px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--muted)',
                verticalAlign: 'top',
              }}
            >
              {t('description')}
            </td>
            {products.map((p) => (
              <td
                key={p.id}
                style={{
                  border: '1px solid var(--line)',
                  padding: '16px',
                  fontSize: '13px',
                  color: 'var(--text)',
                  verticalAlign: 'top',
                  lineHeight: 1.6,
                }}
              >
                {p.descriptionHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                  />
                ) : (
                  <p>{p.description}</p>
                )}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
              {t('shortDescription')}
            </td>
            {products.map((p) => (
              <td key={p.id} style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '13px', color: 'var(--text)' }}>
                {p.description.length > 150 ? `${p.description.substring(0, 150)}...` : p.description}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
              {t('brandName')}
            </td>
            {products.map((p) => (
              <td key={p.id} style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '13px', color: 'var(--text)' }}>
                {p.vendor || t('na')}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
              {t('byActivity')}
            </td>
            {products.map((p) => (
              <td key={p.id} style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '13px', color: 'var(--text)' }}>
                {p.tags && p.tags.length > 0 ? p.tags.slice(0, 2).join(', ') : t('na')}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
              {t('byProductType')}
            </td>
            {products.map((p) => (
              <td key={p.id} style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '13px', color: 'var(--text)' }}>
                {p.productType || t('na')}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
              {t('contentType')}
            </td>
            {products.map((p) => (
              <td key={p.id} style={{ border: '1px solid var(--line)', padding: '16px', fontSize: '13px', color: 'var(--text)' }}>
                {t('products')}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
