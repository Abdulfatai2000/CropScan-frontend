'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop, SUPPORTED_CROPS } from '@/types/crops';
import { UploadedPhoto } from '@/types/assessment';
import { useLanguage, Language } from '@/context/LanguageContext';

interface StepCropSelectProps {
  photo: UploadedPhoto;
  selectedCrop: Crop | '';
  onCropSelected: (crop: Crop) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StepCropSelect({
  photo,
  selectedCrop,
  onCropSelected,
  onBack,
  onContinue,
}: StepCropSelectProps) {
  const [search, setSearch] = useState('');
  const { language, setLanguage } = useLanguage();

  const filteredCrops = SUPPORTED_CROPS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.yorubaName.toLowerCase().includes(search.toLowerCase()) ||
      item.scientificName.toLowerCase().includes(search.toLowerCase())
  );

  const isUnsupported = search.trim() !== '' && filteredCrops.length === 0;

  return (
    <section className="assessment-card crop-select-card" aria-labelledby="step2-title">
      <div className="card-title">
        <span>Step 2 of 4</span>
        <h2 id="step2-title">Select the matching crop</h2>
        <p>The crop you select must match the plant in your photo.</p>
      </div>

      <div className="form-layout">
        <div className="mini-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.previewUrl} alt="Selected plant leaf" />
          <div>
            <span>Selected photo</span>
            <strong>{photo.name}</strong>
            <button type="button" onClick={onBack}>
              Change
            </button>
          </div>
        </div>

        <div className="fields">
          <label className="field">
            <span>Search or choose a crop</span>
            <div className="search-field">
              <Icon name="search" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Tomato, Maize, Àgbàdo..."
                aria-label="Filter crops"
              />
            </div>
          </label>

          {isUnsupported ? (
            <div className="unsupported-box" role="alert">
              <Icon name="alert" size={20} />
              <div>
                <strong>Crop not supported yet</strong>
                <p>
                  CropScan AI currently supports Tomato, Maize, Bell pepper, Citrus, and Potato. Please do not select an incorrect crop for an unlisted plant.
                </p>
              </div>
            </div>
          ) : (
            <div className="crop-options" role="radiogroup" aria-label="Supported crops list">
              {filteredCrops.map((item) => {
                const isSelected = selectedCrop === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={isSelected ? 'selected' : ''}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onCropSelected(item.name)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} />
                    <span>{language === 'Yoruba' ? item.yorubaName : item.name}</span>
                    <i>{isSelected && <Icon name="check" size={14} />}</i>
                  </button>
                );
              })}
            </div>
          )}

          <label className="field">
            <span>Guidance language</span>
            <div className="select-field">
              <Icon name="globe" size={18} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Select guidance language"
              >
                <option value="English">English</option>
                <option value="Yoruba">Yorùbá</option>
              </select>
              <Icon name="chevron" size={16} />
            </div>
            <small>Available condition descriptions and prevention guidance will be shown in this language.</small>
          </label>
        </div>
      </div>

      <div className="card-actions between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!selectedCrop} onClick={onContinue}>
          Review Assessment
        </Button>
      </div>
    </section>
  );
}
