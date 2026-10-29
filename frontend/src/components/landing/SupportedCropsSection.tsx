'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SUPPORTED_CROPS } from '@/types/crops';
import { Icon } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';

export function SupportedCropsSection() {
  const { t, language } = useLanguage();

  return (
    <section className="section crops-section" id="crops">
      <div className="wrap">
        <div className="row-heading section-heading">
          <div>
            <span className="kicker">{t('crops.kicker')}</span>
            <h2>{t('crops.heading')}</h2>
          </div>
          <p>{t('crops.subheading')}</p>
        </div>

        <div className="crop-grid">
          {SUPPORTED_CROPS.map((crop) => (
            <Link
              href={`/guide#${crop.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="crop-card"
              key={crop.name}
            >
              <Image
                src={crop.image}
                alt={`${crop.name} foliage specimen`}
                fill
                sizes="(max-width: 800px) 50vw, (max-width: 1100px) 20vw, 320px"
                style={{
                  objectFit: 'cover',
                  objectPosition: crop.position || 'center',
                }}
              />
              <div className="crop-card-content">
                <div className="crop-card-text">
                  <small>{crop.eyebrow}</small>
                  <h3>{language === 'Yoruba' ? crop.yorubaName : crop.name}</h3>
                </div>
                <span className="crop-card-arrow" aria-hidden="true">
                  <Icon name="arrow" size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
