'use client';

import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { UploadedPhoto } from '@/types/assessment';
import { useLanguage } from '@/context/LanguageContext';

interface StepPhotoUploadProps {
  photo: UploadedPhoto | null;
  onPhotoSelected: (photo: UploadedPhoto) => void;
  onPhotoRemoved: () => void;
  onContinue: () => void;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function StepPhotoUpload({
  photo,
  onPhotoSelected,
  onPhotoRemoved,
  onContinue,
}: StepPhotoUploadProps) {
  const { language } = useLanguage();
  const isYo = language === 'Yoruba';

  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(
        isYo
          ? 'Jọ̀wọ́ yan àwòrán JPG, PNG, tàbí WebP tó tọ́.'
          : 'Please choose a valid JPG, PNG, or WebP image.'
      );
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(
        isYo
          ? 'Àwòrán yìí ju 10 MB lọ. Jọ̀wọ́ yan àwòrán tí ó kéré sí i.'
          : 'This image exceeds 10 MB. Please choose a compressed or smaller file.'
      );
      return;
    }

    setError('');
    const previewUrl = URL.createObjectURL(file);
    onPhotoSelected({
      file,
      previewUrl,
      name: file.name,
      sizeBytes: file.size,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processFile(selected);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  return (
    <section className="assessment-card upload-card" aria-labelledby="step1-title">
      <div className="card-title">
        <span>{isYo ? 'Ìgbésẹ̀ 1 nínú 4' : 'Step 1 of 4'}</span>
        <h2 id="step1-title">{isYo ? 'Fi àwòrán ewé kún un' : 'Add a leaf photo'}</h2>
        <p>
          {isYo
            ? 'Lo ewé kan ṣoṣo kí o sì rí i dájú pé àwọn àmì àrùn hàn kedere.'
            : 'Use one leaf and make sure its surface and symptoms are clearly visible.'}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        aria-label="Upload leaf image file"
      />
      <input
        ref={cameraInputRef}
        type="file"
        className="sr-only"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        aria-label="Take leaf photo with device camera"
      />

      {!photo ? (
        <div
          className={`drop-zone ${error ? 'has-error' : ''} ${isDragging ? 'is-dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload photo dropzone"
        >
          <span className="upload-icon">
            <Icon name="upload" size={29} />
          </span>
          <h3>{isYo ? 'Gbé àwòrán ewé tó mọ́lẹ̀ kedere wọlé' : 'Upload a clear photo of a plant leaf'}</h3>
          <p>
            {isYo
              ? 'Wọ́ àwòrán wá síbí, tàbí yàn láti orí ẹ̀rọ rẹ.'
              : 'Drag and drop a photo here, or choose one from your device.'}
          </p>
          <div className="upload-actions" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="primary"
              icon="image"
              onClick={() => fileInputRef.current?.click()}
            >
              {isYo ? 'Yan Àwòrán' : 'Choose Photo'}
            </Button>
            <Button
              variant="outline"
              icon="camera"
              onClick={() => cameraInputRef.current?.click()}
            >
              {isYo ? 'Ya Àwòrán' : 'Take Photo'}
            </Button>
          </div>
          <small>{isYo ? 'JPG, PNG tàbí WebP · Ó pọ̀ jùlọ 10 MB' : 'JPG, PNG or WebP · Maximum 10 MB'}</small>
        </div>
      ) : (
        <div className="preview-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.previewUrl} alt="Selected leaf preview" />
          <div className="preview-details">
            <span className="success-badge">
              <Icon name="check" size={15} /> {isYo ? 'A ti fi àwòrán kún un' : 'Photo added'}
            </span>
            <h3>{photo.name}</h3>
            <p>
              {(photo.sizeBytes / 1024 / 1024).toFixed(2)} MB · {photo.file.type.replace('image/', '').toUpperCase()}
            </p>
            <div className="preview-actions">
              <Button
                variant="outline"
                icon="refresh"
                onClick={() => fileInputRef.current?.click()}
              >
                {isYo ? 'Yí Àwòrán Padà' : 'Change Photo'}
              </Button>
              <Button variant="ghost" icon="trash" onClick={onPhotoRemoved}>
                {isYo ? 'Yọ Kúrò' : 'Remove'}
              </Button>
            </div>
          </div>
          <div className="preview-check">
            <strong>{isYo ? 'Kí o tó tẹ̀síwájú' : 'Before continuing'}</strong>
            <p>
              {isYo
                ? 'Ǹjẹ́ o lè rí gbogbo ewé náà àti àwọn àmì àìsàn náà kedere?'
                : 'Can you clearly see the whole leaf and the affected symptomatic area?'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="inline-error" role="alert">
          <Icon name="alert" size={18} /> {error}
        </div>
      )}

      <div className="photo-tips">
        <strong>{isYo ? 'Fún àwòrán tó dára jù' : 'For a better photo'}</strong>
        <span>
          <Icon name="check" size={14} /> {isYo ? 'Lo ìmọ́lẹ̀ oòrùn tó mọ́' : 'Use even daylight'}
        </span>
        <span>
          <Icon name="check" size={14} /> {isYo ? 'Mú kámẹ́rà dúró dáadáa' : 'Hold the camera steady'}
        </span>
        <span>
          <Icon name="check" size={14} /> {isYo ? 'Jẹ́ kí ewé náà kún ojú àwòrán' : 'Fill the frame with the leaf'}
        </span>
      </div>

      <div className="card-actions right">
        <Button disabled={!photo} onClick={onContinue}>
          {isYo ? 'Tẹ̀síwájú sí Yíyan Irúgbìn' : 'Continue to Crop'}
        </Button>
      </div>
    </section>
  );
}
