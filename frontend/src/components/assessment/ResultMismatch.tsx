import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

interface ResultMismatchProps {
  previewUrl: string;
  selectedCrop: Crop;
  detectedCrop?: string;
  mismatchReason?: string;
  onChooseCorrectCrop: () => void;
  onDashboard: () => void;
}

export function ResultMismatch({
  previewUrl,
  selectedCrop,
  detectedCrop,
  mismatchReason,
  onChooseCorrectCrop,
  onDashboard,
}: ResultMismatchProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const defaultMessage = isYo
    ? `Ẹ̀ka ohun ọ̀gbìn tí àwòṣe fura sí ${detectedCrop ? `(ó ṣeé ṣe kí ó jẹ́ "${detectedCrop}")` : ''} kò bá ohun ọ̀gbìn tí o yàn mu (${selectedCrop}). A dáwọ́ ìtọ́sọ́nà ìtọ́jú àrùn dúró láti dènà lílo oògùn tí kò tọ́ lórí ohun ọ̀gbìn mìíràn.`
    : `The leaf’s predicted plant category ${detectedCrop ? `(possibly "${detectedCrop}")` : ''} does not match your selected crop (${selectedCrop}). Disease-specific guidance has been withheld to avoid harmful cross-species chemical recommendations.`;

  return (
    <section className="assessment-card state-card" aria-labelledby="mismatch-title">
      <div className="state-icon">
        <Icon name="alert" size={32} />
      </div>
      <span className="kicker">
        {isYo ? 'Ìkìlọ̀ ààbò yíyan irúgbìn' : 'Crop selection safety warning'}
      </span>
      <h2 id="mismatch-title">
        {isYo ? 'Ohun Ọ̀gbìn Tí A Fura Sí Kò Bá Èyí Tí O Yàn Mu' : 'The Predicted Crop May Not Match Your Selection'}
      </h2>
      <p className="state-body">
        {mismatchReason || defaultMessage}
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted leaf" />
        <div>
          <span>{isYo ? 'Ohun ọ̀gbìn tí o yàn' : 'Selected crop'}</span>
          <strong>{selectedCrop}</strong>
          <small>
            {isYo ? 'A pa àwòrán rẹ mọ́ láti tún un yàn.' : 'Your uploaded image is kept ready for correction.'}
          </small>
        </div>
      </div>

      <div className="state-tips">
        <strong>{isYo ? 'Àwọn ìgbésẹ̀ tó yẹ lẹ́yìn èyí:' : 'Recommended next steps:'}</strong>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Ṣàyẹ̀wò irú ohun ọ̀gbìn tí o yàn lẹ́ẹ̀kan sí i' : 'Review your selected crop variety'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Yan ohun ọ̀gbìn tó bá ewé rẹ mu gan-an' : 'Choose only the crop that genuinely matches your plant'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Ya àwòrán mìíràn tí èyí kò bá jẹ́ ewé tó tọ́' : 'Take a different photo if this was the wrong leaf'}
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
            {isYo ? 'Ààbò Ohun Ọ̀gbìn: ' : 'Crop Safety Notice: '}
          </strong>
          {isYo
            ? 'A dáwọ́ ìtọ́sọ́nà ìtọ́jú dúró fún ààbò rẹ láti dènà lílo oògùn tó lè pa ohun ọ̀gbìn mìíràn lára.'
            : 'Treatment guidance is strictly suppressed when crop identity is in doubt to prevent dangerous cross-crop chemical contamination.'}
        </p>
      </div>

      <div className="card-actions center" style={{ marginTop: 24 }}>
        <Button variant="outline" onClick={onDashboard}>
          {isYo ? 'Padà sí Àkópọ̀' : 'Back to Dashboard'}
        </Button>
        <Button icon="check" onClick={onChooseCorrectCrop}>
          {isYo ? 'Yan Ohun Ọ̀gbìn Tó Tọ́' : 'Choose the Correct Crop'}
        </Button>
      </div>
    </section>
  );
}
