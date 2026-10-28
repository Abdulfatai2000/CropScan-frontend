'use client';

import React, { FormEvent } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="assessment-card review-card" onSubmit={handleSubmit} aria-labelledby="step3-title">
      <div className="card-title">
        <span>Step 3 of 4</span>
        <h2 id="step3-title">Review before submitting</h2>
        <p>Confirm the photo and crop are correct. Your image will not be cleared if a request fails.</p>
      </div>

      <div className="review-grid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.previewUrl} alt="Leaf being submitted for assessment" />
        <div className="review-details">
          <div>
            <span>Selected Crop</span>
            <strong>{crop}</strong>
            <button type="button" onClick={onEditCrop}>
              Edit
            </button>
          </div>
          <div>
            <span>Guidance Language</span>
            <strong>{language}</strong>
            <button type="button" onClick={onEditCrop}>
              Edit
            </button>
          </div>
          <div>
            <span>Foliage Photo</span>
            <strong>{photo.name}</strong>
            <small>{(photo.sizeBytes / 1024 / 1024).toFixed(2)} MB</small>
          </div>
        </div>
      </div>

      <div className="advisory">
        <Icon name="info" size={20} />
        <p>
          <strong>Important Advisory:</strong> CropScan AI provides an AI-assisted visual screening aid, not a confirmed laboratory diagnosis.
        </p>
      </div>

      <div className="card-actions between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" icon="scan">
          Analyze Leaf
        </Button>
      </div>
    </form>
  );
}
