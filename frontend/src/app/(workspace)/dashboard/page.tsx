'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Badge } from '@/components/common/Badge';
import { SUPPORTED_CROPS } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const { language } = useLanguage();

  const isYo = language === 'Yoruba';

  return (
    <div className="dashboard">
      <div className="page-intro">
        <div>
          <span className="kicker">{isYo ? 'Ẹ kàárọ̀' : 'Good morning'}</span>
          <h1>{isYo ? 'Káàbọ̀ sí CropScan AI' : 'Welcome to CropScan AI'}</h1>
          <p>
            {isYo
              ? 'Ṣàyẹ̀wò ewé fún àwọn ìṣòro ìlera ohun ọ̀gbìn.'
              : 'Check a leaf for potential crop health problems and get localized field guidance.'}
          </p>
        </div>
        <Button href="/scan" icon="scan">
          {isYo ? 'Ṣàyẹ̀wò Tuntun' : 'New Assessment'}
        </Button>
      </div>

      <section className="start-card">
        <div className="start-card-art">
          <div className="mini-scan">
            <Icon name="leaf" size={42} />
            <i />
          </div>
        </div>
        <div className="start-card-copy">
          <span className="small-badge">
            <Icon name="spark" size={14} /> AI-assisted screening
          </span>
          <h2>{isYo ? 'Bẹ̀rẹ̀ Àyẹ̀wò Ohun Ọ̀gbìn' : 'Start a Plant Assessment'}</h2>
          <p>
            {isYo
              ? 'Gbé àwòrán ewé sókè láti bẹ̀rẹ̀ àyẹ̀wò ìmọ̀ ẹ̀rọ. Ó rọrùn láti ṣe ní ìgbésẹ̀ díẹ̀.'
              : 'Upload a leaf photo to begin an AI-assisted screening. It only takes a few simple, guided steps.'}
          </p>
          <Button href="/scan">{isYo ? 'Bẹ̀rẹ̀ Àyẹ̀wò Tuntun' : 'Start New Scan'}</Button>
        </div>
        <div className="start-meta">
          <span>{isYo ? 'Kí o tó bẹ̀rẹ̀' : 'Before you begin'}</span>
          <strong>{isYo ? 'Lo ewé kan tó mọ́' : 'Use one clear leaf'}</strong>
          <strong>{isYo ? 'Yan ohun ọ̀gbìn tó bá a mu' : 'Choose the matching crop'}</strong>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel supported-panel">
          <div className="panel-head">
            <div>
              <span className="kicker">{isYo ? 'Tó wà lárọ̀ọ́wọ́tó' : 'Ready to scan'}</span>
              <h2>{isYo ? 'Àwọn Ohun Ọ̀gbìn' : 'Supported crops'}</h2>
            </div>
            <Badge variant="count">5 crops</Badge>
          </div>
          <div className="compact-crops">
            {SUPPORTED_CROPS.map((crop) => (
              <Link
                key={crop.name}
                href={`/scan?crop=${encodeURIComponent(crop.name)}`}
                title={`Start scan for ${crop.name}`}
              >
                <div style={{ position: 'relative', width: '100%', height: 74 }}>
                  <Image
                    src={crop.image}
                    alt={crop.name}
                    fill
                    sizes="110px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <span>{isYo ? crop.yorubaName : crop.name}</span>
                <Icon name="arrow" size={16} />
              </Link>
            ))}
          </div>
        </section>

        <section className="panel tips-panel">
          <div className="panel-head">
            <div>
              <span className="kicker">{isYo ? 'Àtòjọ Àwòrán' : 'Photo checklist'}</span>
              <h2>{isYo ? 'Gba Àyẹ̀wò Tó Péye' : 'Get a better result'}</h2>
            </div>
            <span className="panel-icon">
              <Icon name="camera" size={20} />
            </span>
          </div>
          <ul className="check-list">
            {[
              isYo ? 'Ya àwòrán ewé kan kedere' : 'Photograph one leaf clearly',
              isYo ? 'Lo ìmọ́lẹ̀ oòrùn tó mọ́' : 'Use natural, even lighting',
              isYo ? 'Rí i dájú pé ewé náà hàn kedere' : 'Keep the leaf in sharp focus',
              isYo ? 'Má ṣe jẹ́ kí ìka ọwọ́ bo ewé náà' : 'Keep your fingers out of frame',
            ].map((tip) => (
              <li key={tip}>
                <span>
                  <Icon name="check" size={14} />
                </span>
                {tip}
              </li>
            ))}
          </ul>
          <div className="tip-note">
            <Icon name="info" size={18} />
            <span>JPG, PNG or WebP · Up to 10 MB</span>
          </div>
        </section>
      </div>

      <section className="panel empty-history">
        <div className="panel-head">
          <div>
            <span className="kicker">{isYo ? 'Iṣẹ́ Rẹ' : 'Your activity'}</span>
            <h2>{isYo ? 'Àwọn Àyẹ̀wò Àìpẹ́' : 'Recent assessments'}</h2>
          </div>
          <Badge variant="future">Requires backend history</Badge>
        </div>
        <div className="empty-row">
          <span className="empty-icon">
            <Icon name="history" size={28} />
          </span>
          <div>
            <strong>{isYo ? 'Kò tíì sí àyẹ̀wò kankan' : 'No assessments yet'}</strong>
            <p>
              {isYo
                ? 'Àyẹ̀wò àkọ́kọ́ rẹ bẹ̀rẹ̀ níbí. A kì í fi àbájáde pamọ́ sórí ẹ̀rọ yìí.'
                : 'Your first scan starts here. Results are not persisted on this device.'}
            </p>
          </div>
          <Button variant="outline" href="/scan">
            {isYo ? 'Bẹ̀rẹ̀ àyẹ̀wò' : 'Start a scan'}
          </Button>
        </div>
      </section>
    </div>
  );
}
