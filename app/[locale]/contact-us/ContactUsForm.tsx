'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ENQUIRY_TYPES = [
  'availability',
  'recommendation',
  'technical',
  'siteVisit',
  'pricing',
  'delivery',
  'trade',
] as const;

export default function ContactUsForm() {
  const t = useTranslations('ContactUs');
  const tForms = useTranslations('Forms');
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-soft)' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px', color: 'var(--uae-green)' }}>✓</div>
        <h2 style={{ color: 'var(--navy)', marginBottom: '10px', fontSize: '20px' }}>{t('successTitle')}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
          {t('successMessage')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label={t('formHeading')}>
      <h2 style={{ color: 'var(--navy)', fontSize: '20px', margin: '0 0 8px' }}>{t('formHeading')}</h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '20px' }}>
        {t('formHelper')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="contact-name">{t('name')}</label>
          <input id="contact-name" name="name" type="text" required />
        </div>
        <div className="formrow">
          <label htmlFor="contact-company">{t('company')}</label>
          <input id="contact-company" name="company" type="text" required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="contact-phone">{t('phone')}</label>
          <input id="contact-phone" name="phone" type="tel" required />
        </div>
        <div className="formrow">
          <label htmlFor="contact-email">{t('email')}</label>
          <input id="contact-email" name="email" type="email" required />
        </div>
      </div>

      <div className="formrow">
        <label htmlFor="contact-type">{t('enquiryType')}</label>
        <select id="contact-type" name="enquiryType" className="softselect" style={{ width: '100%', height: '48px' }} required defaultValue="">
          <option value="" disabled>{t('selectEnquiryType')}</option>
          {ENQUIRY_TYPES.map((key) => (
            <option key={key} value={key}>{t(`enquiryTypes.${key}`)}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="contact-product">{t('product')}</label>
          <input id="contact-product" name="product" type="text" required />
        </div>
        <div className="formrow">
          <label htmlFor="contact-qty">{t('quantity')}</label>
          <input id="contact-qty" name="quantity" type="text" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="contact-emirate">{t('emirate')}</label>
          <select id="contact-emirate" name="emirate" className="softselect" style={{ width: '100%', height: '48px' }} required defaultValue="">
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
        <div className="formrow">
          <label htmlFor="contact-location">{t('projectLocation')}</label>
          <input id="contact-location" name="projectLocation" type="text" />
        </div>
      </div>

      <div className="formrow">
        <label htmlFor="contact-date">{t('requiredDate')}</label>
        <input id="contact-date" name="requiredDate" type="text" placeholder={t('requiredDatePlaceholder')} />
      </div>

      <div className="formrow">
        <label htmlFor="contact-message">{t('message')}</label>
        <textarea id="contact-message" name="message" rows={5} required style={{ width: '100%', minHeight: '120px' }} />
      </div>

      <div className="formrow">
        <label htmlFor="contact-upload">{t('upload')}</label>
        <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--r-soft)', boxShadow: 'var(--sh-soft)' }}>
          <input
            id="contact-upload"
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

      <button type="submit" className="btn primary" style={{ width: '100%', marginTop: '8px' }}>
        {t('submit')}
      </button>
    </form>
  );
}
