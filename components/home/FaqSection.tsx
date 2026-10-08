'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FaqSection() {
  const t = useTranslations('FAQ');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const FAQS = [0, 1, 2, 3].map((i) => ({
    question: t(`items.${i}.question`),
    answer: t(`items.${i}.answer`),
  }));

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="section" style={{ background: '#fff', margin: '0 28px 64px', borderRadius: 'var(--r-card)', padding: '48px 40px', boxShadow: 'var(--sh-soft)' }}>
      <div className="sectionhead" style={{ marginBottom: '32px' }}>
        <div>
          <div className="kicker">{t('support')}</div>
          <h3 style={{ borderBottom: 'none', margin: 0, padding: 0 }}>{t('title')}</h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {FAQS.map((faq, i) => (
          <div 
            key={i} 
            style={{ 
              border: '1px solid var(--line)', 
              borderRadius: '8px', 
              overflow: 'hidden',
              transition: 'all var(--motion)'
            }}
          >
            <button 
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                background: openIdx === i ? 'rgba(9, 79, 168, 0.04)' : '#fff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--navy)'
              }}
            >
              {faq.question}
              <svg 
                className="ic sm" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{
                  transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--motion)'
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div 
              style={{ 
                maxHeight: openIdx === i ? '500px' : '0', 
                opacity: openIdx === i ? 1 : 0,
                padding: openIdx === i ? '0 24px 20px' : '0 24px',
                background: openIdx === i ? 'rgba(9, 79, 168, 0.04)' : '#fff',
                transition: 'all 0.3s ease-in-out',
                color: 'var(--muted)',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
