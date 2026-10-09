import type { Metadata } from 'next';
import BulkInquiryForm from '@/components/bulk-inquiries/BulkInquiryForm';
import { getAllProducts } from '@/lib/shopify-api';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Trade and Project Volume Pricing | Imperial',
  description:
    'Request volume, pallet or contract pricing with BOQ upload, material recommendations and UAE delivery planning from Mussafah, Abu Dhabi.',
};

export default async function BulkInquiriesPage() {
  const t = await getTranslations('Forms');
  const { products } = await getAllProducts({ first: 250 });

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{t('home')}</Link> / <span>{t('bulk.breadcrumb')}</span>
      </div>

      <div className="rfqwrap">
        <div className="kicker">{t('bulk.kicker')}</div>
        <h1>{t('bulk.title')}</h1>
        <div className="sub">
          {t('bulk.subtitle')}
        </div>

        <BulkInquiryForm products={products} />
      </div>
    </>
  );
}
