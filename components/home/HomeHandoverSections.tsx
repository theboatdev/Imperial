import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import TrustStripMarquee from './TrustStripMarquee';

const sectionPad: CSSProperties = {
  padding: '36px 28px',
};

/** Navy trust strip — sits directly under the hero */
export async function HomeTrustStrip() {
  const t = await getTranslations('Home');
  const trustItems = [0, 1, 2, 3, 4].map((i) => t(`trustItems.${i}`));

  return <TrustStripMarquee label={t('trustLabel')} items={trustItems} />;
}

export default async function HomeHandoverSections() {
  const t = await getTranslations('Home');

  const services = [0, 1, 2, 3, 4].map((i) => ({
    title: t(`services.${i}.title`),
    body: t(`services.${i}.body`),
  }));
  const steps = [0, 1, 2, 3, 4].map((i) => t(`howItWorksSteps.${i}`));

  return (
    <>
      {/* Direct answer + introduction */}
      <section style={sectionPad}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
            gap: '20px',
            alignItems: 'stretch',
          }}
          className="home-answer-grid"
        >
          <div
            style={{
              padding: '24px 26px',
              background: 'linear-gradient(135deg, var(--slot) 0%, #fff 60%)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-panel)',
            }}
          >
            <h2
              style={{
                color: 'var(--navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                fontSize: 'clamp(22px, 2.6vw, 30px)',
                margin: '0 0 12px',
                lineHeight: 1.2,
              }}
            >
              {t('directAnswerTitle')}
            </h2>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.75, color: 'var(--text)', textAlign: 'justify' }}>
              {t('directAnswer')}
            </p>
          </div>

          <div
            style={{
              padding: '24px 26px',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-panel)',
              boxShadow: 'var(--sh-track)',
            }}
          >
            <div className="kicker" style={{ marginBottom: '10px' }}>{t('introKicker')}</div>
            <h2
              style={{
                color: 'var(--navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                fontSize: 'clamp(22px, 2.6vw, 30px)',
                margin: '0 0 12px',
                lineHeight: 1.2,
              }}
            >
              {t('introTitle')}
            </h2>
            <p style={{ margin: '0 0 10px', fontSize: '14.5px', lineHeight: 1.7, color: 'var(--muted)' }}>
              {t('introBody1')}
            </p>
            <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.7, color: 'var(--muted)' }}>
              {t('introBody2')}
            </p>
          </div>
        </div>
        <style>{`
          @media (max-width: 820px) {
            .home-answer-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Image tile placeholders — before Core services */}
      <section style={{ ...sectionPad, paddingBottom: 12 }} aria-label={t('imageTilesLabel')}>
        <div className="home-image-tiles">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="home-image-tile-placeholder"
              role="img"
              aria-label={t('imageTileLabel', { n })}
            >
              <span className="home-image-tile-kicker">{t('imageTileKicker')}</span>
              <span className="home-image-tile-title">{t('imageTileTitle', { n })}</span>
              <span className="home-image-tile-hint">{t('imageTileHint')}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Core services */}
      <section style={sectionPad}>
        <div className="sectionhead" style={{ marginBottom: '18px' }}>
          <div>
            <div className="kicker">{t('servicesKicker')}</div>
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>{t('servicesTitle')}</h3>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          {services.map((item, i) => (
            <div
              key={item.title}
              style={{
                padding: '18px 16px',
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-soft)',
                boxShadow: 'var(--sh-track)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--imperial-blue)',
                  fontSize: '20px',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  marginBottom: '8px',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
                {item.title}
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: 'var(--muted)' }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={sectionPad}>
        <div className="sectionhead" style={{ marginBottom: '18px' }}>
          <div>
            <div className="kicker">{t('howItWorksKicker')}</div>
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>{t('howItWorksTitle')}</h3>
          </div>
          <Link href="/rfq" className="viewall">
            <span className="dot">
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
            {t('howItWorksCta')}
          </Link>
        </div>
        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gap: '8px',
          }}
        >
          {steps.map((step, i) => (
            <li
              key={step}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: '14px',
                alignItems: 'start',
                padding: '14px 16px',
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-soft)',
              }}
            >
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(9, 79, 168, 0.1)',
                  color: 'var(--imperial-blue)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--text)', paddingTop: '6px' }}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Service coverage */}
      <section style={{ ...sectionPad, paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="home-coverage">
          <div className="home-coverage-copy">
            <div className="kicker" style={{ marginBottom: '10px' }}>{t('coverageKicker')}</div>
            <h3 style={{ margin: '0 0 12px', maxWidth: '28ch', borderBottom: 'none', paddingBottom: 0 }}>
              {t('coverageTitle')}
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '14.5px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '62ch' }}>
              {t('coverageBody')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/uae-service-areas" className="btn primary" style={{ textDecoration: 'none' }}>
                {t('coverageCtaPrimary')}
              </Link>
              <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
                {t('coverageCtaSecondary')}
              </Link>
            </div>
          </div>
          <div className="home-coverage-map">
            <Image
              src="/United Arab Emirates Cartographic Infographic.png"
              alt={t('coverageMapAlt')}
              width={1672}
              height={941}
              sizes="(max-width: 820px) 400px, 480px"
              className="home-coverage-map-img"
              unoptimized
            />
            <a
              href="https://maps.app.goo.gl/FUtnahfQ8fyU7M139?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="home-coverage-locate"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>{t('coverageLocate')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Brands + Technical resources */}
      <section style={{ ...sectionPad, paddingBottom: '40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '14px',
          }}
          className="home-resource-grid"
        >
          <div
            style={{
              padding: '22px 22px',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-panel)',
              boxShadow: 'var(--sh-track)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div className="kicker">{t('brandsKicker')}</div>
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>{t('brandsTitle')}</h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: 'var(--muted)', flex: 1 }}>
              {t('brandsBody')}
            </p>
            <Link href="/brands" className="hero-link" style={{ alignSelf: 'flex-start' }}>
              {t('brandsCta')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div
            style={{
              padding: '22px 22px',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-panel)',
              boxShadow: 'var(--sh-track)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div className="kicker">{t('techKicker')}</div>
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>{t('techTitle')}</h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: 'var(--muted)', flex: 1 }}>
              {t('techBody')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/technical-resources" className="btn primary" style={{ textDecoration: 'none' }}>
                {t('techCtaPrimary')}
              </Link>
              <Link href="/contact-us" className="btn secondary" style={{ textDecoration: 'none' }}>
                {t('techCtaSecondary')}
              </Link>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 700px) {
            .home-resource-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
