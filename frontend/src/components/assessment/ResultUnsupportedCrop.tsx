import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

interface ResultUnsupportedCropProps {
  previewUrl: string;
  selectedCrop: Crop | string;
  unsupportedReason?: string;
  onChooseSupportedCrop: () => void;
  onDashboard: () => void;
}

export function ResultUnsupportedCrop({
  previewUrl,
  selectedCrop,
  unsupportedReason,
  onChooseSupportedCrop,
  onDashboard,
}: ResultUnsupportedCropProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const defaultMessage = isYo
    ? `Ohun ọ̀gbìn "${selectedCrop}" kò tíì wà nínú àkójọ àwòṣe CropScan AI. Ní báyìí, àwọn ohun ọ̀gbìn márùn-ún (5) nìkan ni a lè ṣàyẹ̀wò: Tòmátò, Àgbàdo, Ata tàbí Tatasé, Ọsàn, àti Pọtétò. A dáwọ́ ìtọ́sọ́nà ìtọ́jú dúró láti dènà lílo oògùn tí kò bójú mu.`
    : `The crop "${selectedCrop}" is not currently in the CropScan AI diagnostic catalog. We currently support 5 prototype crops: Tomato, Maize, Bell pepper, Citrus, and Potato. Guidance and chemical treatments have been intentionally withheld to prevent hazardous misapplication.`;

  return (
    <section className="assessment-card state-card" aria-labelledby="unsupported-title">
      <div className="state-icon">
        <Icon name="alert" size={32} />
      </div>
      <span className="kicker">
        {isYo ? 'Irúgbìn tí kò tíì wà nínú àkójọ' : 'Unsupported crop'}
      </span>
      <h2 id="unsupported-title">
        {isYo ? 'Ohun Ọ̀gbìn Yìí Kò Tíì Wà Nínú Àkójọ' : 'Crop Not Supported by CropScan AI'}
      </h2>
      <p className="state-body">
        {unsupportedReason || defaultMessage}
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted crop image" />
        <div>
          <span>{isYo ? 'Ohun ọ̀gbìn tí o yàn' : 'Requested crop'}</span>
          <strong>{selectedCrop}</strong>
          <small>
            {isYo
              ? 'A kò tíì kọ́ àwòṣe lórí àwọn àrùn ohun ọ̀gbìn yìí.'
              : 'Our 38-class model has not been trained on this crop.'}
          </small>
        </div>
      </div>

      <div className="state-tips">
        <strong>{isYo ? 'Àwọn ohun ọ̀gbìn tí a gbà wọlé ní báyìí:' : 'Currently supported prototype crops:'}</strong>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Tòmátò (Tomato)' : 'Tomato (Lycopersicon esculentum)'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Àgbàdo (Maize)' : 'Maize / Corn (Zea mays)'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Ata tàbí Tatasé (Bell Pepper)' : 'Bell Pepper (Capsicum annuum)'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Ọsàn (Citrus)' : 'Citrus (Citrus sinensis)'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Pọtétò tàbí Kànàmọ́ (Potato)' : 'Potato (Solanum tuberosum)'}
        </span>
      </div>

      {/* Safety Notice Banner */}
      <div
        className="responsible-note"
        style={{
          marginTop: 20,
          maxWidth: 500,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '14px 18px',
          borderRadius: 12,
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          textAlign: 'left',
        }}
      >
        <span style={{ color: 'var(--green)', marginTop: 2, flexShrink: 0 }}>
          <Icon name="shield" size={17} />
        </span>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text)', fontWeight: 600 }}>
            {isYo ? 'Ààbò Irúgbìn: ' : 'Scope Safety Notice: '}
          </strong>
          {isYo
            ? 'A kò fi àṣẹ fún àyẹ̀wò àrùn lórí ohun ọ̀gbìn tí kò wà nínú àkójọ wa láti dènà àṣìṣe olóró.'
            : 'Automated diagnoses are strictly withheld for unsupported crop varieties to prevent off-label pesticide recommendations.'}
        </p>
      </div>

      <div className="card-actions center" style={{ marginTop: 24 }}>
        <Button variant="outline" onClick={onDashboard}>
          {isYo ? 'Padà sí Àkópọ̀' : 'Back to Dashboard'}
        </Button>
        <Button icon="check" onClick={onChooseSupportedCrop}>
          {isYo ? 'Yan Irúgbìn Tí A Gbà Wọlé' : 'Select a Supported Crop'}
        </Button>
      </div>
    </section>
  );
}
