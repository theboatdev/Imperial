'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TechnicalResourcesFaq() {
  const t = useTranslations('TechnicalResources');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [0, 1, 2, 3].map((i) => ({
    question: t(`faqs.${i}.question`),
    answer: t(`faqs.${i}.answer`),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {faqs.map((faq, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
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
              onClick={() => setOpenIdx(open ? null : i)}
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
              {faq.question}
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
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
