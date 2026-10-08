'use client';

import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Errors');

  return (
    <div className="error-page">
      <h1>{t('somethingWrong')}</h1>
      <p>{error.message || t('unexpectedError')}</p>
      <button onClick={reset}>{t('tryAgain')}</button>
    </div>
  );
}
