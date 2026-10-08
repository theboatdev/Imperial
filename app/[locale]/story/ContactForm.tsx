'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('Forms');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Simulate form submission - replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For now, just log the data and show success
      console.log('Form submitted:', formData);
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(t('contact.error'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form" style={{ marginTop: '48px' }}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          {t('contact.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
          placeholder={t('contact.namePlaceholder')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          {t('contact.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
          placeholder={t('contact.emailPlaceholder')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject" className="form-label">
          {t('contact.subject')}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="form-input"
          placeholder={t('contact.subjectPlaceholder')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">
          {t('contact.message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="form-textarea"
          placeholder={t('contact.messagePlaceholder')}
        />
      </div>

      {status === 'success' && (
        <div className="form-success">
          {t('contact.success')}
        </div>
      )}

      {status === 'error' && (
        <div className="form-error">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="form-submit"
      >
        {status === 'submitting' ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  );
}
