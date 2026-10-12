import type { Metadata } from 'next';
import SolutionPageLayout, { generateSolutionMetadata } from '@/components/solutions/SolutionPageLayout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionMetadata('anchoringFixingTitle', 'anchoringFixingDescription');
}

export default async function AnchoringFixingPage() {
  const t = await getTranslations('AnchoringFixing');

  return (
    <SolutionPageLayout
      namespace="AnchoringFixing"
      metaTitleKey="anchoringFixingTitle"
      metaDescKey="anchoringFixingDescription"
      heroImage="/category-tools.webp"
      imageLeft
      related={[
        {
          href: '/products',
          label: t('relatedFixings'),
          hint: t('relatedHints.0'),
          image: '/category-tools.webp',
        },
        {
          href: '/products',
          label: t('relatedTools'),
          hint: t('relatedHints.1'),
          image: '/category-building-materials.webp',
        },
        {
          href: '/technical-resources',
          label: t('relatedTech'),
          hint: t('relatedHints.2'),
          image: '/category-chemicals.webp',
        },
        {
          href: '/uae-project-supply',
          label: t('relatedProject'),
          hint: t('relatedHints.3'),
          image: '/collections/bonding.webp',
        },
      ]}
    />
  );
}
