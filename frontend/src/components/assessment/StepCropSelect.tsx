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
  const isYo = language === 'Yoruba';

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
        <span>{isYo ? 'Ìgbésẹ̀ 2 nínú 4' : 'Step 2 of 4'}</span>
        <h2 id="step2-title">{isYo ? 'Yan ohun ọ̀gbìn tó bá a mu' : 'Select the matching crop'}</h2>
        <p>
          {isYo
            ? 'Ohun ọ̀gbìn tí o yàn gbọ́dọ̀ bá ohun tó wà nínú àwòrán rẹ mu.'
            : 'The crop you select must match the plant in your photo.'}
        </p>
      </div>

      <div className="form-layout">
        <div className="mini-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.previewUrl} alt="Selected plant leaf" />
          <div>
            <span>{isYo ? 'Àwòrán tí a yàn' : 'Selected photo'}</span>
            <strong>{photo.name}</strong>
            <button type="button" onClick={onBack}>
              {isYo ? 'Yí padà' : 'Change'}
            </button>
          </div>
        </div>

        <div className="fields">
          <label className="field">
            <span>{isYo ? 'Wá tàbí yan ohun ọ̀gbìn' : 'Search or choose a crop'}</span>
            <div className="search-field">
              <Icon name="search" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isYo ? 'f.a. Tòmátò, Àgbàdo, Ata...' : 'e.g. Tomato, Maize, Bell pepper...'}
                aria-label="Filter crops"
              />
            </div>
          </label>

          {isUnsupported ? (
            <div className="unsupported-box" role="alert">
              <Icon name="alert" size={20} />
              <div>
                <strong>{isYo ? 'A kò tíì tìlẹ́yìn ohun ọ̀gbìn yìí' : 'Crop not supported yet'}</strong>
                <p>
                  {isYo
                    ? 'CropScan AI tìlẹ́yìn Tòmátò, Àgbàdo, Ata, Ọsàn, àti Pọtétò ní báyìí. Jọ̀wọ́ má ṣe yan ohun ọ̀gbìn tí kò bá a mu fún ewé tí kò sí nínú àkójọ.'
                    : 'CropScan AI currently supports Tomato, Maize, Bell pepper, Citrus, and Potato. Please do not select an incorrect crop for an unlisted plant.'}
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
                    <span>{isYo ? item.yorubaName : item.name}</span>
                    <i>{isSelected && <Icon name="check" size={14} />}</i>
                  </button>
                );
              })}
            </div>
          )}

          <label className="field">
            <span>{isYo ? 'Èdè ìtọ́sọ́nà' : 'Guidance language'}</span>
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
            <small>
              {isYo
                ? 'Àwọn àpèjúwe àrùn àti ìtọ́sọ́nà ìdènà yóò hàn ní èdè yìí.'
                : 'Available condition descriptions and prevention guidance will be shown in this language.'}
            </small>
          </label>
        </div>
      </div>

      <div className="card-actions between">
        <Button variant="ghost" onClick={onBack}>
          {isYo ? 'Padà' : 'Back'}
        </Button>
        <Button disabled={!selectedCrop} onClick={onContinue}>
          {isYo ? 'Ṣàyẹ̀wò Kí O Tó Ránṣẹ́' : 'Review Assessment'}
        </Button>
      </div>
    </section>
  );
}
