import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

interface ResultNotALeafProps {
  previewUrl: string;
  selectedCrop: Crop;
  rejectionMessage?: string;
  onUploadAnother: () => void;
  onDashboard: () => void;
}

export function ResultNotALeaf({
  previewUrl,
  selectedCrop,
  rejectionMessage,
  onUploadAnother,
  onDashboard,
}: ResultNotALeafProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const defaultMessage = isYo
    ? 'Àyẹ̀wò ìmọ̀ ẹ̀rọ kò rí àmì ewéko tàbí ewé irúgbìn tó péye nínú àwòrán yìí. Ó ṣeé ṣe kí àwòrán náà jẹ́ ogiri, aṣọ, ilẹ̀, ike, tàbí ohun tí kì í ṣe ewéko. A dáwọ́ àyẹ̀wò dúró láti dènà àṣìṣe ìtọ́jú.'
    : 'Our automated computer vision screener could not detect sufficient crop leaf tissue in this photograph. The image appears to contain non-plant materials, background clutter, or non-vegetative objects (such as walls, fabric, floors, plastic, or furniture). Inference was stopped to prevent misleading diagnoses.';

  return (
    <section className="assessment-card state-card" aria-labelledby="not-a-leaf-title">
      <div className="state-icon">
        <Icon name="alert" size={32} />
      </div>
      <span className="kicker">
        {isYo ? 'Àyẹ̀wò ewé kò ní àrídájú' : 'Leaf presence validation issue'}
      </span>
      <h2 id="not-a-leaf-title">
        {isYo ? 'A Kò Rí Ewé Irúgbìn Nínú Àwòrán Yìí' : 'No Assessable Crop Leaf Detected'}
      </h2>
      <p className="state-body">
        {rejectionMessage || defaultMessage}
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted photo without assessable leaf" />
        <div>
          <span>{isYo ? 'Ohun ọ̀gbìn tí o yàn' : 'Selected crop'}</span>
          <strong>{selectedCrop}</strong>
          <small>
            {isYo
              ? 'A dáwọ́ àyẹ̀wò ìmọ̀ ẹ̀rọ dúró láti dènà àṣìṣe lórí àwòrán tí kì í ṣe ewé.'
              : 'Inference bypassed to prevent false diagnosis on non-leaf imagery.'}
          </small>
        </div>
      </div>

      <div className="state-tips">
        <strong>{isYo ? 'Bí o ṣe lè ya àwòrán ewé tó péye:' : 'How to capture a valid leaf photo:'}</strong>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Mú ewé kan ṣoṣo wá sí iwájú kámẹ́rà rẹ' : 'Hold a single crop leaf directly in front of the camera'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Rí i dájú pé ewé náà gba ó kéré tán ìdajì àwòrán náà' : 'Ensure the leaf blade fills at least 60% of the photo frame'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Yẹra fún yíya ogiri, aṣọ, ilẹ̀, ike, tàbí ohun tí kì í ṣe ewéko' : 'Avoid photographing walls, fabric, floors, plastic, or background clutter'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Ya àwòrán lábẹ́ ìmọ́lẹ̀ oòrùn tó mọ́ kedere láìsí òjìji tó le' : 'Capture the image in natural daylight without harsh flash or deep shadows'}
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
            {isYo ? 'Ààbò Ṣàyẹ̀wò: ' : 'Validation Notice: '}
          </strong>
          {isYo
            ? 'Àwọn àwòrán tí kì í ṣe ewéko gbọ́dọ̀ jẹ́ kíkọ̀ kí àwòṣe má baà ṣe àkọsílẹ̀ àrùn èké.'
            : 'Non-botanical imagery is filtered out before classifier evaluation to prevent nonsensical diagnoses.'}
        </p>
      </div>

      <div className="card-actions center" style={{ marginTop: 24 }}>
        <Button variant="outline" onClick={onDashboard}>
          {isYo ? 'Padà sí Àkópọ̀' : 'Back to Dashboard'}
        </Button>
        <Button icon="camera" onClick={onUploadAnother}>
          {isYo ? 'Ṣàyẹ̀wò Àwòrán Mìíràn' : 'Analyze Another Image'}
        </Button>
      </div>
    </section>
  );
}
