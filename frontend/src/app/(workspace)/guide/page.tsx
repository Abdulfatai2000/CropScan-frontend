'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import { SUPPORTED_CROPS } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

export default function GuidePage() {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  return (
    <div className="simple-page">
      <div className="page-intro">
        <div>
          <span className="kicker">{isYo ? 'Ìwé Ohun Ọ̀gbìn' : 'Crop guide'}</span>
          <h1>{isYo ? 'Kọ́ Nípa Àwọn Ohun Ọ̀gbìn' : 'Learn about supported crops'}</h1>
          <p>
            {isYo
              ? 'Àwọn ìmọ̀ràn àwòrán àti ẹ̀ka ohun ọ̀gbìn tí ẹ̀rọ wa mọ̀ dájú.'
              : 'Photo tips and model-backed crop categories, without invented treatment advice.'}
          </p>
        </div>
      </div>

      <div className="future-banner mint">
        <Icon name="book" size={20} />
        <div>
          <strong>{isYo ? 'Àkójọ Ìmọ̀ Ẹ̀kọ́ Pípé' : 'Learning library foundation'}</strong>
          <p>
            {isYo
              ? 'Àpèjúwe àìsàn àti ìmọ̀ràn ìtọ́jú yóò wá láti ibi ìpamọ́ wa nígbà tí ó bá wà lárọ̀ọ́wọ́tó.'
              : 'Disease descriptions and recommendations should be populated only from verified agronomic catalogs when that data is available.'}
          </p>
        </div>
      </div>

      <div className="guide-grid">
        {SUPPORTED_CROPS.map((crop) => (
          <article className="guide-card" key={crop.name} id={crop.name.toLowerCase().replace(/\s+/g, '-')}>
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 190 }}>
              <Image
                src={crop.image}
                alt={`${crop.name} plant`}
                fill
                sizes="(max-width: 560px) 115px, 180px"
                style={{ objectFit: 'cover', objectPosition: crop.position || 'center' }}
              />
            </div>
            <div>
              <span>{crop.eyebrow}</span>
              <h2>{isYo ? crop.yorubaName : crop.name}</h2>
              <p>
                {crop.description} Supported for leaf image assessment. Select this crop only when it genuinely matches your plant.
              </p>
              <Link href={`/scan?crop=${encodeURIComponent(crop.name)}`}>
                Scan {crop.name} <Icon name="arrow" size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
