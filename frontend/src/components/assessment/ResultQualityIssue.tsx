import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

interface ResultQualityIssueProps {
  previewUrl: string;
  selectedCrop: Crop;
  qualityWarning?: string;
  onUploadAnother: () => void;
  onDashboard: () => void;
}

export function ResultQualityIssue({
  previewUrl,
  selectedCrop,
  qualityWarning,
  onUploadAnother,
  onDashboard,
}: ResultQualityIssueProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const defaultWarning = isYo
    ? 'Àwòrán tí o gbé wọlé kò mọ́lẹ̀ tó, ó ṣókùnkùn jù, ó tàn jù, tàbí kò ṣe kedere fún àyẹ̀wò ìmọ̀ ẹ̀rọ.'
    : 'The uploaded photograph is too blurry, overly dark, overexposed, or uniform for a reliable computer vision assessment.';

  return (
    <section className="assessment-card state-card" aria-labelledby="quality-title">
      <div className="state-icon">
        <Icon name="camera" size={32} />
      </div>
      <span className="kicker">
        {isYo ? 'Ìṣòro dídára àwòrán' : 'Image quality screening issue'}
      </span>
      <h2 id="quality-title">
        {isYo ? 'Jọ̀wọ́ Gbìyànjú Àwòrán Tó Mọ́ Kedere' : 'Please Try a Clearer Photo'}
      </h2>
      <p className="state-body">
        {qualityWarning || defaultWarning}
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted leaf with quality issue" />
        <div>
          <span>{isYo ? 'Ohun ọ̀gbìn tí o yàn' : 'Selected crop'}</span>
          <strong>{selectedCrop}</strong>
          <small>
            {isYo ? 'Àyẹ̀wò dídára kọ àwòrán yìí fún ààbò rẹ.' : 'Image rejected by automated pre-screening checks.'}
          </small>
        </div>
      </div>

      <div className="state-tips">
        <strong>{isYo ? 'Bí o ṣe lè ya àwòrán ewé tó péye:' : 'How to capture a valid leaf photo:'}</strong>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Lọ sí ibi tí ìmọ́lẹ̀ oòrùn ti tàn dáradára' : 'Move to even, indirect natural sunlight'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Mú fóònù rẹ dúró ṣinṣin kí àwòrán má baà gbọ̀n' : 'Hold the smartphone camera steady to avoid motion blur'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Rí i dájú pé ewé náà gba gbogbo ojú àwòrán' : 'Ensure the leaf blade fills at least 60% of the frame'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Nu ojú kámẹ́rà kí o sì tẹ̀ ẹ́ láti fojú sùn àwọn àmì náà' : 'Clean the camera lens and tap the screen to focus on the spots'}
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
            {isYo ? 'Ààbò Dídára: ' : 'Quality Screening Notice: '}
          </strong>
          {isYo
            ? 'Àyẹ̀wò dídára àwòrán tẹ́lẹ̀ ń dènà àṣìṣe àyẹ̀wò tí ìmọ́lẹ̀ tàbí gbígbọ̀n àwòrán lè fà.'
            : 'Pre-screening validation protects farmers against inaccurate predictions triggered by poor focus or uneven field illumination.'}
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
