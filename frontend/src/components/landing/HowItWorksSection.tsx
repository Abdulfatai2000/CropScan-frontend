'use client';

import React from 'react';
import { Icon, IconName } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';

interface StepItem {
  icon: IconName;
  number: string;
  titleKey: string;
  descKey: string;
}

const STEPS: StepItem[] = [
  {
    icon: 'upload',
    number: '01',
    titleKey: 'how.step1Title',
    descKey: 'how.step1Desc',
  },
  {
    icon: 'leaf',
    number: '02',
    titleKey: 'how.step2Title',
    descKey: 'how.step2Desc',
  },
  {
    icon: 'spark',
    number: '03',
    titleKey: 'how.step3Title',
    descKey: 'how.step3Desc',
  },
];

export function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section-heading centered">
          <span className="kicker">{t('how.kicker')}</span>
          <h2>{t('how.heading')}</h2>
          <p>{t('how.subheading')}</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((step) => (
            <div className="step-card" key={step.number}>
              <span className="step-number" aria-hidden="true">{step.number}</span>
              <div className="step-icon">
                <Icon name={step.icon} size={26} />
              </div>
              <h3>{t(step.titleKey)}</h3>
              <p>{t(step.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
