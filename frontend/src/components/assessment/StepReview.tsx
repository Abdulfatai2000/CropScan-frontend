'use client';

import React, { FormEvent } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop, SUPPORTED_CROPS } from '@/types/crops';
import { UploadedPhoto } from '@/types/assessment';
import { useLanguage } from '@/context/LanguageContext';

interface StepReviewProps {
  photo: UploadedPhoto;
  crop: Crop;
  onEditPhoto: () => void;
  onEditCrop: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepReview({
  photo,
  crop,
  onEditCrop,
  onBack,
  onSubmit,
}: StepReviewProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const cropInfo = SUPPORTED_CROPS.find((c) => c.name === crop);
  const cropDisplay = isYo ? (cropInfo?.yorubaName || crop) : crop;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="assessment-card review-card" onSubmit={handleSubmit} aria-labelledby="step3-title">
      <div className="card-title">
        <span>{isYo ? 'Ìgbésẹ̀ 3 nínú 4' : 'Step 3 of 4'}</span>
        <h2 id="step3-title">{isYo ? 'Ṣàyẹ̀wò kí o tó fi ránṣẹ́' : 'Review before submitting'}</h2>
        <p>
          {isYo
            ? 'Ṣàyẹ̀wò àwòrán àti ohun ọ̀gbìn kí o tó ránṣẹ́. Àwòrán rẹ kò ní sọnù tí ìsopọ̀ bá kùnà.'
            : 'Confirm the photo and crop are correct. Your image will not be cleared if a request fails.'}
        </p>
      </div>

      <div className="review-grid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.previewUrl} alt="Leaf being submitted for assessment" />
        <div className="review-details">
          <div>
            <span>{isYo ? 'Ohun Ọ̀gbìn Tí O Yàn' : 'Selected Crop'}</span>
            <strong>{cropDisplay}</strong>
            <button type="button" onClick={onEditCrop}>
              {isYo ? 'Àtúnṣe' : 'Edit'}
            </button>
          </div>
          <div>
            <span>{isYo ? 'Èdè Ìtọ́sọ́nà' : 'Guidance Language'}</span>
            <strong>{isYo ? 'Yorùbá' : 'English'}</strong>
            <button type="button" onClick={onEditCrop}>
              {isYo ? 'Àtúnṣe' : 'Edit'}
            </button>
          </div>
          <div>
            <span>{isYo ? 'Àwòrán Ewé' : 'Foliage Photo'}</span>
            <strong>{photo.name}</strong>
            <small>{(photo.sizeBytes / 1024 / 1024).toFixed(2)} MB</small>
          </div>
        </div>
      </div>

      <div className="advisory">
        <Icon name="info" size={20} />
        <p>
          <strong>{isYo ? 'Ìkìlọ̀ Pàtàkì:' : 'Important Advisory:'}</strong>{' '}
          {isYo
            ? 'CropScan AI jẹ́ ẹ̀rọ ìrànwọ́ àyẹ̀wò ewé, kì í ṣe àyẹ̀wò àrídájú ilé-ìwòsàn àgbẹ̀.'
            : 'CropScan AI provides an AI-assisted visual screening aid, not a confirmed laboratory diagnosis.'}
        </p>
      </div>

      <div className="card-actions between">
        <Button variant="ghost" onClick={onBack}>
          {isYo ? 'Padà' : 'Back'}
        </Button>
        <Button type="submit" icon="scan">
          {isYo ? 'Ṣàyẹ̀wò Ewé' : 'Analyze Leaf'}
        </Button>
      </div>
    </form>
  );
}
