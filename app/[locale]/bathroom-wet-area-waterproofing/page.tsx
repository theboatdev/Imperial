import type { Metadata } from 'next';
import SolutionPageLayout, { generateSolutionMetadata } from '@/components/solutions/SolutionPageLayout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionMetadata('bathroomWetAreaTitle', 'bathroomWetAreaDescription');
}

export default async function BathroomWetAreaPage() {
  const t = await getTranslations('BathroomWetArea');

  return (
    <SolutionPageLayout
      namespace="BathroomWetArea"
      metaTitleKey="bathroomWetAreaTitle"
      metaDescKey="bathroomWetAreaDescription"
      heroImage="/collections/waterproofing.webp"
      related={[
        {
          href: '/products?collection=waterproofing',
          label: t('relatedWaterproofing'),
          hint: t('relatedHints.0'),
          image: '/collections/waterproofing.webp',
        },
        {
          href: '/products?collection=adhesive',
          label: t('relatedAdhesives'),
          hint: t('relatedHints.1'),
          image: '/collections/adhesive.webp',
        },
        {
          href: '/products?collection=sealent',
          label: t('relatedSealants'),
          hint: t('relatedHints.2'),
          image: '/collections/sealent.webp',
        },
        {
          href: '/tile-installation-systems',
          label: t('relatedTileSystems'),
          hint: t('relatedHints.3'),
          image: '/category-building-materials.webp',
        },
      ]}
    />
  );
}
