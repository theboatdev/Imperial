import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="imp-footer">
      {/* Statement banner */}
      <div className="footer-statement">
        <div>
          <div className="eyebrow on-dark">{t('eyebrow')}</div>
          <h2>{t('tagline1')}<br />{t('tagline2')}</h2>
        </div>
        <Link href="/rfq" className="btn primary" style={{ textDecoration: 'none' }}>
          {t('cta')}
          <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Columns */}
      <div className="footer-columns">
        {/* Shop */}
        <div className="col imp-footer-col">
          <h6>{t('shop')}</h6>
          <Link href="/products?collection=waterproofing">{t('waterproofing')}</Link>
          <Link href="/products?collection=adhesive">{t('adhesives')}</Link>
          <Link href="/products?collection=sealent">{t('sealants')}</Link>
          <Link href="/products?collection=bonding">{t('bonding')}</Link>
        </div>

        {/* Trade */}
        <div className="col imp-footer-col">
          <h6>{t('trade')}</h6>
          <Link href="/rfq">{t('requestQuote')}</Link>
          <Link href="/bulk-inquiries">{t('bulkOrderTerms')}</Link>
          <Link href="/company">{t('theCompany')}</Link>
          <div>{t('projectCredit')}</div>
        </div>

        {/* Support */}
        <div className="col imp-footer-col">
          <h6>{t('support')}</h6>
          <Link href="/coverage-calculator">{t('coverageCalculator')}</Link>
          <Link href="/rfq">{t('sendInquiry')}</Link>
          <Link href="/products">{t('productSpecialists')}</Link>
          <div>{t('documents')}</div>
          <div>{t('technicalSupport')}</div>
        </div>

        {/* Imperial */}
        <div className="col imp-footer-col">
          <h6>{t('imperial')}</h6>
          <div>{t('email')}</div>
          <div>{t('address')}</div>
          <div>
            <a href="tel:+97126442611" style={{ color: 'inherit', textDecoration: 'none' }}>{t('landline')}</a>
          </div>
          <div>
            <a href="https://wa.me/971566694324" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              {t('whatsapp')}
            </a>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#637b9c' }}>
            {t('securedCheckout')}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom imp-footer-bottom">
        <span>{t('copyright', { year })}</span>
        <span>{t('taglineBottom')}</span>
      </div>
    </footer>
  );
}
