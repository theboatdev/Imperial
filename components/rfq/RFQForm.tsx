'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RFQForm() {
  const t = useTranslations('Forms');
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--uae-green)' }}>✓</div>
        <h2 style={{ color: 'var(--navy)', marginBottom: '12px', fontSize: '22px' }}>{t('rfq.successTitle')}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
          {t('rfq.successMessage')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label={t('rfq.title')}>
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
        {t('rfq.helper')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="rfq-company">{t('rfq.company')}</label>
          <input id="rfq-company" type="text" placeholder={t('rfq.companyPlaceholder')} required />
        </div>
        <div className="formrow">
          <label htmlFor="rfq-project">{t('rfq.projectName')}</label>
          <input id="rfq-project" type="text" placeholder={t('rfq.projectNamePlaceholder')} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="rfq-email">{t('rfq.email')}</label>
          <input id="rfq-email" type="email" placeholder={t('rfq.emailPlaceholder')} required />
        </div>
        <div className="formrow">
          <label htmlFor="rfq-phone">{t('rfq.phone')}</label>
          <input id="rfq-phone" type="tel" placeholder={t('rfq.phonePlaceholder')} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="rfq-product">{t('rfq.material')}</label>
          <input id="rfq-product" type="text" placeholder={t('rfq.materialPlaceholder')} />
        </div>
        <div className="formrow">
          <label htmlFor="rfq-qty">{t('rfq.quantity')}</label>
          <input id="rfq-qty" type="text" placeholder={t('rfq.quantityPlaceholder')} required />
        </div>
      </div>

      <div className="formrow">
        <label htmlFor="rfq-application">{t('rfq.application')}</label>
        <input id="rfq-application" type="text" placeholder={t('rfq.applicationPlaceholder')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="rfq-budget">{t('rfq.budget')}</label>
          <input id="rfq-budget" type="text" placeholder={t('rfq.budgetPlaceholder')} />
        </div>
        <div className="formrow">
          <label htmlFor="rfq-timeline">{t('rfq.timeline')}</label>
          <input id="rfq-timeline" type="text" placeholder={t('rfq.timelinePlaceholder')} />
        </div>
      </div>

      <div className="formrow">
        <label htmlFor="rfq-location">{t('rfq.location')}</label>
        <select id="rfq-location" className="softselect" style={{ width: '100%', height: '48px' }} required defaultValue="">
          <option value="" disabled>{t('rfq.selectEmirate')}</option>
          <option value="abu-dhabi">{t('emirates.abuDhabi')}</option>
          <option value="dubai">{t('emirates.dubai')}</option>
          <option value="sharjah">{t('emirates.sharjah')}</option>
          <option value="ajman">{t('emirates.ajman')}</option>
          <option value="uaq">{t('emirates.uaq')}</option>
          <option value="rak">{t('emirates.rak')}</option>
          <option value="fujairah">{t('emirates.fujairah')}</option>
          <option value="other">{t('emirates.other')}</option>
        </select>
      </div>

      <div className="formrow">
        <label htmlFor="rfq-docs">{t('rfq.upload')}</label>
        <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--r-soft)', boxShadow: 'var(--sh-soft)' }}>
          <input
            id="rfq-docs"
            type="file"
            accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <small style={{ color: 'var(--muted)', marginTop: '6px', display: 'block' }}>{t('rfq.uploadHint')}</small>
          {file && (
            <small style={{ color: 'var(--imperial-blue)', marginTop: '6px', display: 'block', fontWeight: 600 }}>
              {t('rfq.attached', { filename: file.name })}
            </small>
          )}
        </div>
      </div>

      <div className="formrow" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, cursor: 'pointer' }}>
          <input type="checkbox" id="rfq-alternatives" />
          {t('rfq.alternatives')}
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, cursor: 'pointer' }}>
          <input type="checkbox" id="rfq-site-visit" />
          {t('rfq.siteVisit')}
        </label>
      </div>

      <div className="formrow">
        <label htmlFor="rfq-notes">{t('rfq.notes')}</label>
        <textarea id="rfq-notes" rows={3} placeholder={t('rfq.notesPlaceholder')}></textarea>
      </div>

      <button type="submit" className="btn primary block" style={{ marginTop: '20px' }}>
        {t('rfq.submit')}
        <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
