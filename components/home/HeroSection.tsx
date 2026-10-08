'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import BrandWheel from './BrandWheel';

export default function HeroSection() {
  const t = useTranslations('Hero');
  const [activeIdx, setActiveIdx] = useState(0);

  const HERO_SLIDES = [0, 1, 2].map((i) => ({
    l1: t(`slides.${i}.l1`),
    l2: t(`slides.${i}.l2`),
    title: t(`slides.${i}.title`),
    titleLine2: t(`slides.${i}.titleLine2`),
    description: t(`slides.${i}.description`),
    note: t(`slides.${i}.note`),
    artType: i,
  }));

  const slide = HERO_SLIDES[activeIdx];

  const handleStep = (delta: number) => {
    setActiveIdx((prev) => (prev + delta + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Immersive Background Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image 
          src="/Gemini_Generated_Image_s18lxes18lxes18l.png" 
          alt={t('alt')} 
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Soft gradient mask: Solid light on the left for text readability, fading to transparent on the right to show the image */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(90deg, rgba(248, 250, 252, 0.98) 0%, rgba(248, 250, 252, 0.85) 45%, rgba(248, 250, 252, 0.1) 100%)' 
        }} />
      </div>

      <div className="hero-grid" style={{ position: 'relative', zIndex: 10 }}>
        {/* Left rail marker */}
        <div className="hero-rail" aria-hidden="true">
          <svg className="mark ic" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <span className="rule" />
        </div>

        {/* Text copy */}
        <div className="hero-text" key={activeIdx}>
          <div className="hero-flag" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hero-meta">
            <span className="l1">{slide.l1}</span>
            <span className="l2">{slide.l2}</span>
          </div>
          <h1>
            {slide.title}
            <br />
            {slide.titleLine2}
          </h1>
          <p>{slide.description}</p>
          <div className="hero-actions">
            <Link href="/rfq" className="btn line">
              {t('requestQuote')}
            </Link>
            <Link href="/products" className="hero-link">
              {t('browseCatalogue')}
              <svg className="ic sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="hero-nav">
            <button onClick={() => handleStep(-1)} aria-label={t('previousSlide')}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="sep" aria-hidden="true" />
            <button onClick={() => handleStep(1)} aria-label={t('nextSlide')}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stage with dynamic rotating brand wheel */}
        <div className="hero-stage">
          <BrandWheel />
          <p className="hero-note" style={{ position: 'relative', zIndex: 20 }}>{slide.note}</p>
        </div>

        {/* Right dots */}
        <div className="hero-dots" role="tablist" aria-label={t('heroSlides')}>
          {HERO_SLIDES.map((_, i) => (
            <i
              key={i}
              className={i === activeIdx ? 'on' : ''}
              role="tab"
              aria-label={t('slide', { n: i + 1 })}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
