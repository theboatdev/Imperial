import type { Metadata } from 'next';
import RFQForm from '@/components/rfq/RFQForm';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Request Building Materials Quote UAE | Imperial',
  description:
    'Upload a BOQ or material list for technical review, material recommendations, special project pricing and delivery across all seven Emirates.',
};

export default async function RFQPage() {
  const t = await getTranslations('Forms');

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{t('home')}</Link> / <span>{t('rfq.breadcrumb')}</span>
      </div>

      <div className="rfqwrap">
        <div className="kicker">{t('rfq.kicker')}</div>
        <h1>{t('rfq.title')}</h1>
        <div className="sub">
          {t('rfq.subtitle')}
        </div>

        {/* Product context preview */}
        <div className="rfqproduct">
          <div className="ph">
            <svg className="ic lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="n">
            {t('rfq.generalInquiries')}
            <small>{t('rfq.specifyMaterials')}</small>
          </div>
        </div>

        <RFQForm />
      </div>
    </>
  );
}
