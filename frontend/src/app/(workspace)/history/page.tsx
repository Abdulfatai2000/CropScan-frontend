'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';

export default function HistoryPage() {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  return (
    <div className="simple-page">
      <div className="page-intro">
        <div>
          <span className="kicker">{isYo ? 'Ìtàn Àyẹ̀wò' : 'Assessment history'}</span>
          <h1>{isYo ? 'Àwọn Àyẹ̀wò Rẹ Ti Tẹ́lẹ̀' : 'Your previous scans'}</h1>
          <p>
            {isYo
              ? 'Wo àwọn àyẹ̀wò tó ti parí nígbà tí ibi ìpamọ́ bá wà ní àsopọ̀.'
              : 'Review completed assessments when persistent history storage is connected.'}
          </p>
        </div>
      </div>

      <div className="future-banner">
        <Icon name="info" size={20} />
        <div>
          <strong>{isYo ? 'Ìrànlọ́wọ́ Ibi Ìpamọ́ Pọndandan' : 'Backend support required'}</strong>
          <p>
            {isYo
              ? 'Ẹ̀yà yìí kò tíì ní ibi ìpamọ́ àsopọ̀, nítorí náà kò sí àkọsílẹ̀ kankan tí a fipamọ́ sórí ẹ̀rọ yìí.'
              : 'This version does not have a persistent server history endpoint, so no records are presented as saved.'}
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-field disabled">
          <Icon name="search" size={17} />
          <input disabled placeholder={isYo ? 'Wá àwọn àyẹ̀wò...' : 'Search assessments'} />
        </div>
        <button type="button" disabled>
          All crops <Icon name="chevron" size={15} />
        </button>
        <button type="button" disabled>
          Any date <Icon name="chevron" size={15} />
        </button>
      </div>

      <section className="panel large-empty">
        <span className="empty-icon">
          <Icon name="history" size={32} />
        </span>
        <h2>{isYo ? 'Kò sí àyẹ̀wò tí a fipamọ́' : 'No saved assessments'}</h2>
        <p>
          {isYo
            ? 'Nígbà tí a bá so ibi ìpamọ́ pọ̀, àwọn àyẹ̀wò rẹ yóò hàn níbí pẹ̀lú irú ohun ọ̀gbìn, àbájáde, àti ọjọ́.'
            : 'When persistence is implemented, your completed scans will appear here with crop variety, status, confidence score, and inspection date.'}
        </p>
        <Button href="/scan">
          {isYo ? 'Bẹ̀rẹ̀ Àyẹ̀wò Àkọ́kọ́ Rẹ' : 'Start Your First Scan'}
        </Button>
      </section>
    </div>
  );
}
