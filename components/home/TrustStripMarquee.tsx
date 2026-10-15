'use client';

import { useEffect, useRef } from 'react';

interface TrustStripMarqueeProps {
  label: string;
  items: string[];
}

export default function TrustStripMarquee({ label, items }: TrustStripMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let rafId = 0;
    const speed = 0.45; // px per frame at ~60fps

    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current += speed;
        const half = track.scrollWidth / 2;
        if (half > 0 && offsetRef.current >= half) {
          offsetRef.current -= half;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const renderGroup = (keyPrefix: string, ariaHidden?: boolean) => (
    <div className="trust-strip-group" key={keyPrefix} aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <div key={`${keyPrefix}-${item}`} className="trust-strip-item">
          <span className="trust-strip-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="trust-strip-text">{item}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="trust-strip"
      aria-label={label}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="trust-strip-track" ref={trackRef}>
        {renderGroup('a')}
        {renderGroup('b', true)}
      </div>
    </section>
  );
}
