import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('Errors');

  return (
    <div className="error-page">
      <h1>{t('notFound')}</h1>
      <p>{t('notFoundDesc')}</p>
      <Link href="/">{t('returnHome')}</Link>
    </div>
  );
}
