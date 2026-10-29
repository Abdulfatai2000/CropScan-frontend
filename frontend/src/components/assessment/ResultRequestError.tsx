import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

interface ResultRequestErrorProps {
  previewUrl: string;
  selectedCrop: Crop;
  errorMessage?: string;
  onRetry: () => void;
  onDashboard: () => void;
}

export function ResultRequestError({
  previewUrl,
  selectedCrop,
  errorMessage,
  onRetry,
  onDashboard,
}: ResultRequestErrorProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const defaultError = isYo
    ? 'Ẹ̀rọ kò lè ṣe àyẹ̀wò yìí ní báyìí. A ti pa àwòrán rẹ àti ohun ọ̀gbìn tí o yàn mọ́ láìsí ìṣòro.'
    : 'The server could not process this request. Your photo and crop selection have been kept safely.';

  return (
    <section className="assessment-card state-card state-request_error" aria-labelledby="error-title">
      <div className="state-icon">
        <Icon name="refresh" size={32} />
      </div>
      <span className="kicker">
        {isYo ? 'Ìṣòro ìsopọ̀ tàbí ẹ̀rọ' : 'Connection or server problem'}
      </span>
      <h2 id="error-title">
        {isYo ? 'A Kò Lè Pari Àyẹ̀wò Yìí' : 'We Couldn’t Complete the Assessment'}
      </h2>
      <p className="state-body">
        {errorMessage || defaultError}
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted leaf" />
        <div>
          <span>{isYo ? 'Ohun ọ̀gbìn tí o yàn' : 'Selected crop'}</span>
          <strong>{selectedCrop}</strong>
          <small>
            {isYo ? 'Àwòrán rẹ ṣì wà ní ìpamọ́.' : 'Your image remains stored in memory.'}
          </small>
        </div>
      </div>

      <div className="state-tips">
        <strong>{isYo ? 'Àwọn ohun tí a dámọ̀ràn:' : 'Suggested actions:'}</strong>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Ṣàyẹ̀wò ìsopọ̀ intanẹ́ẹ̀tì rẹ' : 'Check your network connection'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Dúró díẹ̀ kí o sì tún gbìyànjú àyẹ̀wò lẹ́ẹ̀kan sí i' : 'Wait a moment and retry analysis'}
        </span>
        <span>
          <Icon name="check" size={15} />{' '}
          {isYo ? 'Àwòrán tí o yàn kò ní sọnù' : 'Your selected image will not be lost'}
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
            {isYo ? 'Àkíyèsí Ẹ̀rọ: ' : 'System Notice: '}
          </strong>
          {isYo
            ? 'Àwọn ìkùnà ẹ̀rọ kì í ṣe ẹ̀rí pé ohun ọ̀gbìn nílera. Gbìyànjú lẹ́ẹ̀kan sí i nígbà tí ẹ̀rọ bá padà bọ̀ sípò.'
            : 'Temporary connectivity disruptions do not provide diagnostic information. Please retry once network connectivity is re-established.'}
        </p>
      </div>

      <div className="card-actions center" style={{ marginTop: 24 }}>
        <Button variant="outline" onClick={onDashboard}>
          {isYo ? 'Padà sí Àkópọ̀' : 'Back to Dashboard'}
        </Button>
        <Button icon="refresh" onClick={onRetry}>
          {isYo ? 'Tún Gbìyànjú' : 'Try Again'}
        </Button>
      </div>
    </section>
  );
}
