import type { Metadata } from 'next';
import SolutionPageLayout, { generateSolutionMetadata } from '@/components/solutions/SolutionPageLayout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionMetadata('concreteRepairTitle', 'concreteRepairDescription');
}

export default async function ConcreteRepairPage() {
  const t = await getTranslations('ConcreteRepair');

  return (
    <SolutionPageLayout
      namespace="ConcreteRepair"
      metaTitleKey="concreteRepairTitle"
      metaDescKey="concreteRepairDescription"
      heroImage="/category-building-materials.webp"
      imageLeft
      related={[
        {
          href: '/products?collection=bonding',
          label: t('relatedRepair'),
          hint: t('relatedHints.0'),
          image: '/collections/bonding.webp',
        },
        {
          href: '/products',
          label: t('relatedCoatings'),
          hint: t('relatedHints.1'),
          image: '/category-paints.webp',
        },
        {
          href: '/technical-resources',
          label: t('relatedTech'),
          hint: t('relatedHints.2'),
          image: '/category-chemicals.webp',
        },
        {
          href: '/products',
          label: t('relatedTools'),
          hint: t('relatedHints.3'),
          image: '/category-tools.webp',
        },
      ]}
    />
  );
}
