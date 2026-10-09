'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const SECTIONS = [
  { key: 'location', count: 4 },
  { key: 'products', count: 4 },
  { key: 'technical', count: 4 },
  { key: 'quotations', count: 4 },
  { key: 'orders', count: 4 },
] as const;

export default function FaqHubClient() {
  const t = useTranslations('FaqHub');
  const [openKey, setOpenKey] = useState<string | null>('location-0');
  const [activeSection, setActiveSection] = useState<string>('location');

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = document.getElementById(`faq-section-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Section navigation */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <h2
            style={{
              color: 'var(--navy)',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              fontSize: 'clamp(22px, 2.4vw, 28px)',
              margin: 0,
            }}
          >
            {t('topicsTitle')}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--faint)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {t('topicsHint')}
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
          {t('topicsIntro')}
        </p>
        <nav
          aria-label={t('topicsTitle')}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '10px',
          }}
          className="faq-hub-nav"
        >
          {SECTIONS.map((section, i) => {
            const active = activeSection === section.key;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => scrollToSection(section.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  background: active ? 'rgba(9, 79, 168, 0.08)' : '#fff',
                  border: `1px solid ${active ? 'rgba(9, 79, 168, 0.28)' : 'var(--line)'}`,
                  borderRadius: 'var(--r-soft)',
                  boxShadow: 'var(--sh-track)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color var(--motion), background var(--motion)',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: '22px',
                    height: '22px',
                    borderRadius: '7px',
                    background: active ? 'rgba(9, 79, 168, 0.14)' : 'rgba(9, 79, 168, 0.1)',
                    color: 'var(--imperial-blue)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.35 }}>
                  {t(`sections.${section.key}.title`)}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* FAQ sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {SECTIONS.map((section) => (
          <section key={section.key} id={`faq-section-${section.key}`} style={{ scrollMarginTop: '96px' }}>
            <h2
              style={{
                color: 'var(--navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                fontSize: 'clamp(20px, 2.2vw, 24px)',
                margin: '0 0 14px',
              }}
            >
              {t(`sections.${section.key}.title`)}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: section.count }, (_, i) => {
                const key = `${section.key}-${i}`;
                const open = openKey === key;
                return (
                  <div
                    key={key}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-soft)',
                      overflow: 'hidden',
                      boxShadow: open ? 'var(--sh-track)' : 'none',
                      background: '#fff',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOpenKey(open ? null : key);
                        setActiveSection(section.key);
                      }}
                      aria-expanded={open}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        padding: '18px 20px',
                        background: open ? 'rgba(9, 79, 168, 0.04)' : '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--navy)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {t(`sections.${section.key}.faqs.${i}.question`)}
                      <span
                        aria-hidden="true"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: open ? 'rgba(9, 79, 168, 0.12)' : 'var(--slot)',
                          color: 'var(--navy)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{
                            transform: open ? 'rotate(180deg)' : 'none',
                            transition: 'transform var(--motion)',
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    {open && (
                      <div
                        style={{
                          padding: '0 20px 18px',
                          background: 'rgba(9, 79, 168, 0.04)',
                          color: 'var(--muted)',
                          fontSize: '14px',
                          lineHeight: 1.75,
                        }}
                      >
                        {t(`sections.${section.key}.faqs.${i}.answer`)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
