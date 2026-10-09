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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {SECTIONS.map((section) => (
        <section key={section.key}>
          <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 14px' }}>
            {t(`sections.${section.key}.title`)}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: section.count }, (_, i) => {
              const key = `${section.key}-${i}`;
              const open = openKey === key;
              return (
                <div
                  key={key}
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : key)}
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
                    }}
                  >
                    {t(`sections.${section.key}.faqs.${i}.question`)}
                    <svg
                      className="ic sm"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform var(--motion)',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {open && (
                    <div
                      style={{
                        padding: '0 20px 18px',
                        background: 'rgba(9, 79, 168, 0.04)',
                        color: 'var(--muted)',
                        fontSize: '14px',
                        lineHeight: 1.7,
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
  );
}
