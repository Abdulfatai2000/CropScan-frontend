import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

interface ResultInconclusiveProps {
  previewUrl: string;
  selectedCrop: Crop;
  description?: string;
  onTryAnotherPhoto: () => void;
  onDashboard: () => void;
}

export function ResultInconclusive({
  previewUrl,
  selectedCrop,
  description,
  onTryAnotherPhoto,
  onDashboard,
}: ResultInconclusiveProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const defaultMessage = isYo
    ? 'Àwòṣe kò rí ìdánilójú tó tó fún ewé yìí. Èyí kò túmọ̀ sí pé ohun ọ̀gbìn rẹ nílera, ṣùgbọ́n a dáwọ́ ìtọ́sọ́nà oògùn dúró fún ààbò rẹ.'
    : 'The model did not produce a sufficiently confident prediction for this leaf. This does not mean your plant is healthy, but actionable chemical guidance has been withheld for safety.';

  return (
    <section className="assessment-card state-card" aria-labelledby="inconclusive-title">
      <div className="state-icon">
        <Icon name="help" size={32} />
      </div>
      <span className="kicker">
        {isYo ? 'Àyẹ̀wò tí kò tíì ní àrídájú' : 'Inconclusive assessment'}
      </span>
      <h2 id="inconclusive-title">
        {isYo ? 'A Kò Lè Mọ Àìsàn Yìí Pẹ̀lú Ìdánilójú Tó Pọ̀' : 'We Couldn’t Identify the Condition Confidently'}
      </h2>
      <p className="state-body">
        {description || defaultMessage}
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted leaf" />
        <div>
          <span>{isYo ? 'Ohun ọ̀gbìn tí o yàn' : 'Selected crop'}</span>
          <strong>{selectedCrop}</strong>
          <small>
            {isYo ? 'A dáwọ́ ìmọ̀ràn oògùn dúró fún ààbò.' : 'Uncertain output withheld from agronomic advice.'}
          </small>
        </div>
      </div>

      <div className="state-tips">
        <strong>{isYo ? 'Àwọn ohun tí o lè ṣe:' : 'What to do next:'}</strong>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Ya àwòrán mìíràn lábẹ́ ìmọ́lẹ̀ oòrùn tó dára' : 'Take another photo under even, natural daylight'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Fojú sùn apá ibi tí àmì àrùn wà jù lórí ewé' : 'Focus closely on the most affected leaf section'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Yẹra fún àwòrán tí ó gbọ̀n tàbí tí kò mọ́lẹ̀' : 'Avoid motion blur, glare, and excessive shadow'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Kan sí òṣìṣẹ́ àgbẹ̀ agbègbè rẹ tí àìsàn náà bá ń le sí i' : 'Consult a local extension officer if symptoms worsen'}
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
            {isYo ? 'Ààbò Ṣàyẹ̀wò: ' : 'Safety Notice: '}
          </strong>
          {isYo
            ? 'Àwọn àbájáde tí kò ní ìdánilójú kò gbọdọ̀ jẹ́ ẹ̀rí pé ohun ọ̀gbìn nílera. Ṣàyẹ̀wò àwòrán mìíràn tàbí kan sí agbóṣẹ́ àgbẹ̀.'
            : 'Low-confidence results must never be taken as proof of crop health. Re-photograph the leaf or consult an agronomy extension officer.'}
        </p>
      </div>

      <div className="card-actions center" style={{ marginTop: 24 }}>
        <Button variant="outline" onClick={onDashboard}>
          {isYo ? 'Padà sí Àkópọ̀' : 'Back to Dashboard'}
        </Button>
        <Button icon="camera" onClick={onTryAnotherPhoto}>
          {isYo ? 'Ṣàyẹ̀wò Àwòrán Mìíràn' : 'Analyze Another Image'}
        </Button>
      </div>
    </section>
  );
}
