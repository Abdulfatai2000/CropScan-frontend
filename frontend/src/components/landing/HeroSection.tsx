'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1721520290342-7d4362e180bb?auto=format&fit=crop&w=1400&q=88';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="home">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span>
              <Icon name="spark" size={15} />
            </span>
            <span>{t('hero.badge')}</span>
          </div>
          <h1>
            Spot Crop Problems.
            <br />
            <em>Make Better Farming Decisions.</em>
          </h1>
          <p>{t('hero.subheading')}</p>
          <div className="hero-actions">
            <Button href="/scan">{t('hero.ctaStart')}</Button>
            <Button variant="outline" href="#how">
              {t('how.heading')}
            </Button>
          </div>
          <div className="trust-line">
            <span>{t('hero.trust1')}</span>
            <span>{t('hero.trust2')}</span>
            <span>{t('hero.trust3')}</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image">
            <Image
              src={HERO_IMAGE}
              alt="Healthy green foliage examined for agricultural disease screening"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 550px"
              style={{ objectFit: 'cover' }}
            />
            <div className="scan-frame" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <div className="scan-line" />
            </div>
            <div className="image-pill image-pill-top">
              <span className="live-dot" />
              <span>{t('hero.badgeLive')}</span>
            </div>
            <div className="image-card">
              <div className="image-card-icon">
                <Icon name="leaf" size={22} />
              </div>
              <div>
                <small>Tomato Foliage Analysis</small>
                <strong>{t('hero.cardCondition')}</strong>
              </div>
              <Icon name="check" size={20} />
            </div>
          </div>
          <div className="photo-credit">Visual reference from unsplash / verified field sample</div>
        </div>
      </div>
    </section>
  );
}
