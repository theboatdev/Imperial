'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    startTransition(() => {
      router.replace(href, { locale: nextLocale });
    });
  };

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={t('language')}
      data-pending={isPending || undefined}
    >
      <button
        type="button"
        className={locale === 'en' ? 'active' : undefined}
        onClick={() => switchLocale('en')}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <span className="lang-sep" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={locale === 'ar' ? 'active' : undefined}
        onClick={() => switchLocale('ar')}
        aria-pressed={locale === 'ar'}
      >
        AR
      </button>
      <span className="lang-sep" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={locale === 'zh' ? 'active' : undefined}
        onClick={() => switchLocale('zh')}
        aria-pressed={locale === 'zh'}
      >
        ZH
      </button>
    </div>
  );
}
