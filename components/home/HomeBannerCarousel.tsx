'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const BANNERS = [
  { src: '/website-banner.webp', alt: 'Imperial website banner' },
  { src: '/promaster-banner.webp', alt: 'Promaster banner' },
];

const INTERVAL_MS = 5000;

export default function HomeBannerCarousel() {
  const t = useTranslations('Hero');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % BANNERS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + BANNERS.length) % BANNERS.length);
  };

  return (
    <section
      className="home-banner-carousel"
      aria-roledescription="carousel"
      aria-label={t('heroSlides')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="home-banner-carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {BANNERS.map((banner) => (
          <div className="home-banner-carousel-slide" key={banner.src}>
            <img src={banner.src} alt={banner.alt} />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="home-banner-carousel-nav prev"
        onClick={() => go(-1)}
        aria-label={t('previousSlide')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        className="home-banner-carousel-nav next"
        onClick={() => go(1)}
        aria-label={t('nextSlide')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <div className="home-banner-carousel-dots" role="tablist" aria-label={t('heroSlides')}>
        {BANNERS.map((banner, i) => (
          <button
            key={banner.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={t('slide', { n: i + 1 })}
            className={i === index ? 'on' : ''}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
