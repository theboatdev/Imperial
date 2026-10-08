import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CompareClient from '@/components/compare/CompareClient';

export const metadata: Metadata = {
  title: 'Compare Products | Imperial',
  description: 'Compare construction materials and systems side-by-side.',
};

export default async function ComparePage() {
  const t = await getTranslations('Compare');

  return (
    <div className="store-frame" style={{ padding: '40px 28px', minHeight: '60vh' }}>
      <h1 style={{ color: 'var(--navy)', marginBottom: '32px', fontSize: '28px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
        {t('title')}
      </h1>
      
      <CompareClient />
    </div>
  );
}
