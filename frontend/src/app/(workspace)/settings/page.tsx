'use client';

import React from 'react';
import { Icon } from '@/components/common/Icon';
import { useLanguage, Language } from '@/context/LanguageContext';

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const isYo = language === 'Yoruba';

  const languages: { code: Language; badge: string; name: string; nativeName: string }[] = [
    { code: 'English', badge: 'EN', name: 'English', nativeName: 'Official (English)' },
    { code: 'Yoruba', badge: 'YO', name: 'Yorùbá', nativeName: 'Èdè Yorùbá' },
  ];

  return (
    <div className="simple-page">
      <div className="page-intro">
        <div>
          <span className="kicker">{isYo ? 'Ètò Ààyò' : 'Preferences'}</span>
          <h1>{isYo ? 'Ètò & Èdè' : 'Settings & language'}</h1>
          <p>
            {isYo
              ? 'Yan bí CropScan AI ṣe ń fi ìmọ̀ràn hàn lórí ẹ̀rọ rẹ.'
              : 'Choose how CropScan AI presents guidance and interface content on this device.'}
          </p>
        </div>
      </div>

      <div className="settings-layout">
        <section className="panel settings-card">
          <div className="settings-title">
            <span className="panel-icon">
              <Icon name="globe" size={22} />
            </span>
            <div>
              <h2>{isYo ? 'Èdè tí o fẹ́' : 'Preferred language'}</h2>
              <p>{isYo ? 'A ń lò ó fún gbogbo àyẹ̀wò àti ìmọ̀ràn.' : 'Used for interface text and available diagnostic guidance.'}</p>
            </div>
          </div>
          <div className="language-options">
            {languages.map((item) => (
              <button
                type="button"
                className={language === item.code ? 'selected' : ''}
                onClick={() => setLanguage(item.code)}
                key={item.code}
              >
                <span>{item.badge}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.nativeName}</small>
                </div>
                <i>{language === item.code && <Icon name="check" size={14} />}</i>
              </button>
            ))}
          </div>
        </section>

        <section className="panel settings-card">
          <div className="settings-title">
            <span className="panel-icon">
              <Icon name="shield" size={22} />
            </span>
            <div>
              <h2>{isYo ? 'Ààbò & Ìpamọ́' : 'Privacy & data'}</h2>
              <p>{isYo ? 'Bí a ṣe ń bójútó àwọn àwòrán rẹ.' : 'How this frontend handles your current inspection session.'}</p>
            </div>
          </div>
          <div className="privacy-list">
            <div>
              <strong>{isYo ? 'Kò gba iforúkọsílẹ̀' : 'No account required'}</strong>
              <span>
                {isYo
                  ? 'Gbogbo àyẹ̀wò wà lárọ̀ọ́wọ́tó láìsí ìbéèrè orúkọ tàbí àkọọ́lẹ̀.'
                  : 'The core assessment flow remains completely available without sign-in.'}
              </span>
            </div>
            <div>
              <strong>{isYo ? 'Kò sí àkọsílẹ̀ kọ̀ǹpútà' : 'No claimed cloud history'}</strong>
              <span>
                {isYo
                  ? 'Ẹ̀rọ yìí kò fi àbájáde pamọ́ sí àwọsánmọ̀ láìsí àsopọ̀ ibi ìpamọ́.'
                  : 'This interface does not store results remotely without an explicit backend database connection.'}
              </span>
            </div>
            <div>
              <strong>{isYo ? 'Fífiranṣẹ́ àwòrán' : 'Image submission safeguard'}</strong>
              <span>
                {isYo
                  ? 'Àwòrán ewé rẹ nìkan ni a máa fi ránṣẹ́ nígbà tí o bá tẹ bọ́tìnnì Àyẹ̀wò.'
                  : 'Your selected leaf photograph is submitted strictly when you proceed to analyze the leaf.'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
