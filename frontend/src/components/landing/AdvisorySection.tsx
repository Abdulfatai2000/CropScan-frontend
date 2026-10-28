'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon, IconName } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';

interface PrincipleItem {
  icon: IconName;
  titleKey: string;
  descKey: string;
}

const PRINCIPLES: PrincipleItem[] = [
  {
    icon: 'image',
    titleKey: 'responsible.item1Title',
    descKey: 'responsible.item1Desc',
  },
  {
    icon: 'alert',
    titleKey: 'responsible.item2Title',
    descKey: 'responsible.item2Desc',
  },
  {
    icon: 'help',
    titleKey: 'responsible.item3Title',
    descKey: 'responsible.item3Desc',
  },
];

export function AdvisorySection() {
  const { t } = useLanguage();

  return (
    <section className="wrap" id="responsible">
      <div className="responsible">
        <div className="responsible-copy">
          <span className="kicker kicker-light">{t('responsible.kicker')}</span>
          <h2>{t('responsible.heading')}</h2>
          <p>{t('responsible.body')}</p>
          <Button variant="secondary" href="/help#responsible">
            Read our responsible-use guide
          </Button>
        </div>

        <div className="responsible-list">
          {PRINCIPLES.map((item) => (
            <div className="responsible-item" key={item.titleKey}>
              <span>
                <Icon name={item.icon} size={20} />
              </span>
              <div>
                <h3>{t(item.titleKey)}</h3>
                <p>{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
