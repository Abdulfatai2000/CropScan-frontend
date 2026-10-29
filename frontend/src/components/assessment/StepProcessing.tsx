import React from 'react';
import { Icon } from '@/components/common/Icon';
import { Crop, SUPPORTED_CROPS } from '@/types/crops';
import { useLanguage } from '@/context/LanguageContext';

interface StepProcessingProps {
  previewUrl: string;
  crop: Crop;
}

export function StepProcessing({ previewUrl, crop }: StepProcessingProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const cropInfo = SUPPORTED_CROPS.find((c) => c.name === crop);
  const cropDisplay = isYo ? (cropInfo?.yorubaName || crop) : crop;

  return (
    <section className="assessment-card processing" aria-live="polite">
      <div className="processing-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Leaf undergoing diagnostic analysis" />
        <div className="processing-scan" aria-hidden="true">
          <span />
        </div>
      </div>
      <span className="processing-badge">
        <i aria-hidden="true" /> {isYo ? 'Àyẹ̀wò ń lọ lọ́wọ́' : 'Assessment in progress'}
      </span>
      <h2>{isYo ? 'À ń ṣàyẹ̀wò ewé rẹ…' : 'Analyzing your leaf…'}</h2>
      <p>
        {isYo
          ? 'CropScan AI ń wo àwọn àmì àìsàn lórí ewé láti pèsè àbájáde tí ó bá a mu.'
          : 'CropScan AI is examining the image for visual patterns associated with supported crop-health conditions.'}
      </p>
      <div className="processing-meta">
        <span>
          <Icon name="leaf" size={17} /> {isYo ? 'Ohun ọ̀gbìn tí a yàn:' : 'Selected crop:'}{' '}
          <strong>{cropDisplay}</strong>
        </span>
        <span>
          <Icon name="shield" size={17} /> {isYo ? 'Jọ̀wọ́ má ṣe ti ojú-ewé yìí' : 'Please keep this page open'}
        </span>
      </div>
      <small>
        {isYo
          ? 'Èyí lè gba ìṣẹ́jú àáyá díẹ̀. A kì yóò fi àwòrán ránṣẹ́ lẹ́ẹ̀mejì.'
          : 'This may take a moment. We will not submit the image twice.'}
      </small>
    </section>
  );
}
