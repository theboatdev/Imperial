import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import ContactUsForm from './ContactUsForm';
import ContactUsFaq from './ContactUsFaq';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('contactTitle'),
    description: t('contactDescription'),
  };
}

export default async function ContactUsPage() {
  const t = await getTranslations('ContactUs');
  const tCommon = await getTranslations('Common');

  const details = [
    { label: t('addressLabel'), value: t('address'), href: null },
    { label: t('landlineLabel'), value: t('landline'), href: 'tel:+97126442611' },
    { label: t('whatsappLabel'), value: t('whatsapp'), href: 'https://wa.me/971566694324' },
    { label: t('emailLabel'), value: t('emailValue'), href: 'mailto:info@imperial.ae' },
    { label: t('hoursLabel'), value: t('hours'), href: null },
    { label: t('coverageLabel'), value: t('coverage'), href: null },
  ] as const;

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">{tCommon('home')}</Link>
        {' / '}
        <span>{t('breadcrumb')}</span>
      </div>

      <div className="store-frame" style={{ padding: '32px 28px 72px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="kicker" style={{ marginBottom: '12px' }}>{t('kicker')}</div>
          <h1 style={{ color: 'var(--navy)', margin: '0 0 16px', fontSize: 'clamp(26px, 3vw, 34px)', lineHeight: 1.15 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text)', margin: '0 0 32px', maxWidth: '720px' }}>
            {t('intro')}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '28px',
              marginBottom: '48px',
              alignItems: 'start',
            }}
          >
            <aside
              style={{
                background: 'var(--slot)',
                borderRadius: 'var(--r-panel)',
                padding: '22px 20px',
                border: '1px solid var(--line)',
              }}
            >
              <h2 style={{ color: 'var(--navy)', fontSize: '18px', margin: '0 0 16px' }}>{t('detailsTitle')}</h2>
              <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {details.map((item) => (
                  <div key={item.label}>
                    <dt style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                      {item.label}
                    </dt>
                    <dd style={{ margin: 0, fontSize: '14px', lineHeight: 1.55, color: 'var(--navy)', fontWeight: 500 }}>
                      {item.href ? (
                        <a href={item.href} style={{ color: 'inherit', textDecoration: 'none' }} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>

            <div style={{ background: '#fff', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)', padding: '24px 22px' }}>
              <ContactUsForm />
            </div>
          </div>

          <section>
            <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 16px' }}>{t('faqTitle')}</h2>
            <ContactUsFaq />
          </section>
        </div>
      </div>
    </>
  );
}
