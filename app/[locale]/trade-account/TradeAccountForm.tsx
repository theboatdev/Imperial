'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TradeAccountForm() {
  const t = useTranslations('TradeAccount');
  const tForms = useTranslations('Forms');
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: '#fff',
          borderRadius: 'var(--r-panel)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--sh-soft)',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px', color: 'var(--uae-green)' }}>✓</div>
        <h2 style={{ color: 'var(--navy)', marginBottom: '10px', fontSize: '20px' }}>{t('successTitle')}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
          {t('successMessage')}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={t('formHeading')}
      style={{
        padding: '24px 22px',
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-panel)',
        boxShadow: 'var(--sh-track)',
      }}
    >
      <h2 style={{ color: 'var(--navy)', fontSize: '18px', margin: '0 0 8px' }}>{t('formHeading')}</h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '20px' }}>
        {t('formHelper')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="trade-company">{t('company')}</label>
          <input id="trade-company" name="company" type="text" required />
        </div>
        <div className="formrow">
          <label htmlFor="trade-licence">{t('tradeLicence')}</label>
          <input id="trade-licence" name="tradeLicence" type="text" required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="trade-vat">{t('vat')}</label>
          <input id="trade-vat" name="vat" type="text" />
        </div>
        <div className="formrow">
          <label htmlFor="trade-business-type">{t('businessType')}</label>
          <select
            id="trade-business-type"
            name="businessType"
            className="softselect"
            style={{ width: '100%', height: '48px' }}
            required
            defaultValue=""
          >
            <option value="" disabled>{t('selectBusinessType')}</option>
            <option value="contractor">{t('businessTypes.contractor')}</option>
            <option value="subcontractor">{t('businessTypes.subcontractor')}</option>
            <option value="maintenance">{t('businessTypes.maintenance')}</option>
            <option value="fitout">{t('businessTypes.fitout')}</option>
            <option value="workshop">{t('businessTypes.workshop')}</option>
            <option value="facility">{t('businessTypes.facility')}</option>
            <option value="procurement">{t('businessTypes.procurement')}</option>
            <option value="other">{t('businessTypes.other')}</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="trade-contact">{t('contactName')}</label>
          <input id="trade-contact" name="contactName" type="text" required />
        </div>
        <div className="formrow">
          <label htmlFor="trade-signatory">{t('signatory')}</label>
          <input id="trade-signatory" name="signatory" type="text" required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="trade-phone">{t('phone')}</label>
          <input id="trade-phone" name="phone" type="tel" required />
        </div>
        <div className="formrow">
          <label htmlFor="trade-email">{t('email')}</label>
          <input id="trade-email" name="email" type="email" required />
        </div>
      </div>

      <div className="formrow">
        <label htmlFor="trade-purchasing">{t('purchasingContacts')}</label>
        <input id="trade-purchasing" name="purchasingContacts" type="text" />
      </div>

      <div className="formrow">
        <label htmlFor="trade-company-address">{t('companyAddress')}</label>
        <input id="trade-company-address" name="companyAddress" type="text" required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="trade-delivery">{t('deliveryAddress')}</label>
          <input id="trade-delivery" name="deliveryAddress" type="text" />
        </div>
        <div className="formrow">
          <label htmlFor="trade-emirate">{t('emirate')}</label>
          <select
            id="trade-emirate"
            name="emirate"
            className="softselect"
            style={{ width: '100%', height: '48px' }}
            required
            defaultValue=""
          >
            <option value="" disabled>{t('selectEmirate')}</option>
            <option value="abu-dhabi">{tForms('emirates.abuDhabi')}</option>
            <option value="dubai">{tForms('emirates.dubai')}</option>
            <option value="sharjah">{tForms('emirates.sharjah')}</option>
            <option value="ajman">{tForms('emirates.ajman')}</option>
            <option value="uaq">{tForms('emirates.uaq')}</option>
            <option value="rak">{tForms('emirates.rak')}</option>
            <option value="fujairah">{tForms('emirates.fujairah')}</option>
            <option value="other">{tForms('emirates.other')}</option>
          </select>
        </div>
      </div>

      <div className="formrow">
        <label htmlFor="trade-notes">{t('notes')}</label>
        <textarea
          id="trade-notes"
          name="notes"
          rows={4}
          style={{ width: '100%', minHeight: '100px' }}
          placeholder={t('notesPlaceholder')}
        />
      </div>

      <div className="formrow">
        <label htmlFor="trade-upload">{t('upload')}</label>
        <div style={{ background: 'var(--slot)', padding: '16px', borderRadius: 'var(--r-soft)' }}>
          <input
            id="trade-upload"
            type="file"
            accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <small style={{ color: 'var(--muted)', marginTop: '6px', display: 'block' }}>{t('uploadHint')}</small>
          {file && (
            <small style={{ color: 'var(--imperial-blue)', marginTop: '6px', display: 'block', fontWeight: 600 }}>
              {t('attached', { filename: file.name })}
            </small>
          )}
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--faint)', lineHeight: 1.6, margin: '8px 0 16px' }}>
        {t('creditNote')}
      </p>

      <button type="submit" className="btn primary" style={{ width: '100%' }}>
        {t('submit')}
      </button>
    </form>
  );
}
