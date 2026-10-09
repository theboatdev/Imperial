import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('companyTitle'),
    description: t('companyDescription'),
  };
}

export default async function CompanyPage() {
  const t = await getTranslations('Pages');
  const tCommon = await getTranslations('Common');

  const values = [1, 2, 3, 4, 5, 6].map((n) => t(`value${n}` as 'value1'));

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCommon('home')}</Link>
        {' / '}
        <span>{t('aboutTitle')}</span>
      </div>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line)' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/Gemini_Generated_Image_s18lxes18lxes18l.webp"
            alt={t('aboutTitle')}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(105deg, rgba(7, 27, 70, 0.78) 0%, rgba(7, 27, 70, 0.45) 48%, rgba(7, 27, 70, 0.12) 100%)',
            }}
          />
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            minHeight: '380px',
            height: '42vh',
            maxHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '48px 28px 44px',
            color: '#fff',
            background: 'transparent',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '920px', width: '100%', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            <span style={{ width: '22px', height: '1.5px', background: 'rgba(255,255,255,0.55)', flexShrink: 0 }} aria-hidden="true" />
            {t('aboutKicker')}
          </div>
          <h1
            style={{
              margin: '0 0 12px',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              fontSize: 'clamp(28px, 4vw, 44px)',
              lineHeight: 1.12,
              maxWidth: '16ch',
              color: '#fff',
            }}
          >
            {t('aboutTitle')}
          </h1>
          <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65, opacity: 0.9, maxWidth: '42ch' }}>
            {t('aboutLocation')}
          </p>
          </div>
        </div>
      </section>

      <div className="store-frame" style={{ padding: '48px 28px 80px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          {/* Intro */}
          <section style={{ marginBottom: '52px' }}>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text)', margin: '0 0 18px', textAlign: 'justify' }}>
              {t('aboutSummary')}
            </p>
            <p style={{ fontSize: '14.5px', lineHeight: 1.8, color: 'var(--muted)', margin: 0, textAlign: 'justify' }}>
              {t('aboutRange')}
            </p>
          </section>

          {/* Mission + Vision */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '56px',
            }}
          >
            <div
              style={{
                padding: '28px 26px',
                background: 'var(--slot)',
                borderRadius: 'var(--r-panel)',
                borderTop: '3px solid var(--imperial-blue)',
              }}
            >
              <div className="kicker" style={{ marginBottom: '12px' }}>{t('missionTitle')}</div>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.75, color: 'var(--navy)' }}>
                {t('mission')}
              </p>
            </div>
            <div
              style={{
                padding: '28px 26px',
                background: '#fff',
                borderRadius: 'var(--r-panel)',
                border: '1px solid var(--line)',
                borderTop: '3px solid var(--uae-green)',
              }}
            >
              <div className="kicker" style={{ marginBottom: '12px' }}>{t('visionTitle')}</div>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.75, color: 'var(--navy)' }}>
                {t('vision')}
              </p>
            </div>
          </section>

          {/* Values */}
          <section style={{ marginBottom: '56px' }}>
            <h2
              style={{
                color: 'var(--navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                fontSize: 'clamp(22px, 2.5vw, 28px)',
                margin: '0 0 22px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--line)',
              }}
            >
              {t('companyValues')}
            </h2>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px 20px',
              }}
            >
              {values.map((value, i) => (
                <li
                  key={value}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--slot)',
                      color: 'var(--navy)',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'grid',
                      placeItems: 'center',
                      marginTop: '1px',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--text)' }}>{value}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <section
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              padding: '28px 26px',
              background: 'var(--navy)',
              borderRadius: 'var(--r-panel)',
              color: '#fff',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.65, marginBottom: '8px' }}>
                {t('aboutCtaKicker')}
              </div>
              <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.4, fontFamily: 'var(--font-display)', fontWeight: 500, maxWidth: '36ch' }}>
                {t('aboutCtaText')}
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/products" className="btn primary" style={{ textDecoration: 'none' }}>
                {t('browseCatalog')}
              </Link>
              <Link
                href="/rfq"
                className="btn secondary"
                style={{
                  textDecoration: 'none',
                  background: 'transparent',
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.35)',
                }}
              >
                {t('contactSales')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
