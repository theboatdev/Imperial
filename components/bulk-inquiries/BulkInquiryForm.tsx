'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ShopifyProduct } from '@/lib/types';

interface Props {
  products: Pick<ShopifyProduct, 'id' | 'title'>[];
}

export default function BulkInquiryForm({ products }: Props) {
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
        <h2 style={{ color: 'var(--navy)', marginBottom: '12px', fontSize: '22px' }}>{t('bulk.successTitle')}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
          {t('bulk.successMessage')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label={t('bulk.title')}>
      <div className="formrow">
        <label htmlFor="bulk-company">{t('bulk.company')}</label>
        <input id="bulk-company" type="text" placeholder={t('bulk.companyPlaceholder')} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="bulk-email">{t('bulk.email')}</label>
          <input id="bulk-email" type="email" placeholder="you@company.ae" required />
        </div>
        <div className="formrow">
          <label htmlFor="bulk-phone">{t('bulk.phone')}</label>
          <input id="bulk-phone" type="tel" placeholder="+971" required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="formrow">
          <label htmlFor="bulk-product">{t('bulk.product')}</label>
          <select id="bulk-product" className="softselect" style={{ width: '100%', height: '48px' }} required defaultValue="">
            <option value="" disabled>{t('bulk.selectProduct')}</option>
            {products.map((p) => (
              <option key={p.id} value={p.title}>
                {p.title}
              </option>
            ))}
            <option value="other">{t('bulk.otherProducts')}</option>
          </select>
        </div>
        <div className="formrow">
          <label htmlFor="bulk-qty">{t('bulk.quantity')}</label>
          <input id="bulk-qty" type="text" placeholder={t('bulk.quantityPlaceholder')} required />
        </div>
      </div>

      <div className="formrow">
        <label htmlFor="bulk-location">{t('bulk.location')}</label>
        <select id="bulk-location" className="softselect" style={{ width: '100%', height: '48px' }} defaultValue="">
          <option value="">{t('bulk.selectEmirate')}</option>
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
        <label htmlFor="bulk-docs">{t('bulk.upload')}</label>
        <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--r-soft)', boxShadow: 'var(--sh-soft)' }}>
          <input
            id="bulk-docs"
            type="file"
            accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <small style={{ color: 'var(--muted)', marginTop: '6px', display: 'block' }}>{t('bulk.uploadHint')}</small>
          {file && (
            <small style={{ color: 'var(--imperial-blue)', marginTop: '6px', display: 'block', fontWeight: 600 }}>
              {t('bulk.attached', { filename: file.name })}
            </small>
          )}
        </div>
      </div>

      <div className="formrow">
        <label htmlFor="bulk-notes">{t('bulk.details')}</label>
        <textarea id="bulk-notes" rows={4} placeholder={t('bulk.detailsPlaceholder')} />
      </div>

      <button type="submit" className="btn primary block" style={{ marginTop: '20px' }}>
        {t('bulk.submit')}
        <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <p style={{ marginTop: '16px', fontSize: '11px', color: 'var(--muted)', textAlign: 'center' }}>
        {t('bulk.consent')}
      </p>
    </form>
  );
}
