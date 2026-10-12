import type { Metadata } from 'next';
import SolutionPageLayout, { generateSolutionMetadata } from '@/components/solutions/SolutionPageLayout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionMetadata('industrialFlooringTitle', 'industrialFlooringDescription');
}

export default async function IndustrialFlooringPage() {
  const t = await getTranslations('IndustrialFlooring');

  return (
    <SolutionPageLayout
      namespace="IndustrialFlooring"
      metaTitleKey="industrialFlooringTitle"
      metaDescKey="industrialFlooringDescription"
      heroImage="/category-chemicals.webp"
      related={[
        {
          href: '/products',
          label: t('relatedFlooring'),
          hint: t('relatedHints.0'),
          image: '/category-chemicals.webp',
        },
        {
          href: '/concrete-repair-protection',
          label: t('relatedRepair'),
          hint: t('relatedHints.1'),
          image: '/collections/bonding.webp',
        },
        {
          href: '/products',
          label: t('relatedCleaners'),
          hint: t('relatedHints.2'),
          image: '/category-paints.webp',
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
