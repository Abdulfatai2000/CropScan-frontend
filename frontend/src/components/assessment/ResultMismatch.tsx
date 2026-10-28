import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';

interface ResultMismatchProps {
  previewUrl: string;
  selectedCrop: Crop;
  detectedCrop?: string;
  onChooseCorrectCrop: () => void;
  onDashboard: () => void;
}

export function ResultMismatch({
  previewUrl,
  selectedCrop,
  detectedCrop,
  onChooseCorrectCrop,
  onDashboard,
}: ResultMismatchProps) {
  return (
    <section className="assessment-card state-card" aria-labelledby="mismatch-title">
      <div className="state-icon">
        <Icon name="alert" size={32} />
      </div>
      <span className="kicker">Crop selection safety warning</span>
      <h2 id="mismatch-title">The Predicted Crop May Not Match Your Selection</h2>
      <p className="state-body">
        The leaf’s predicted plant category {detectedCrop ? `(possibly "${detectedCrop}")` : ''} does not match your selected crop ({selectedCrop}). Disease-specific guidance has been withheld to avoid harmful cross-species chemical recommendations.
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted leaf" />
        <div>
          <span>Selected crop</span>
          <strong>{selectedCrop}</strong>
          <small>Your uploaded image is kept ready for correction.</small>
        </div>
      </div>

      <div className="state-tips">
        <strong>Recommended next steps:</strong>
        <span>
          <Icon name="check" size={15} /> Review your selected crop variety
        </span>
        <span>
          <Icon name="check" size={15} /> Choose only the crop that genuinely matches your plant
        </span>
        <span>
          <Icon name="check" size={15} /> Take a different photo if this was the wrong leaf
        </span>
      </div>

      <div className="card-actions center">
        <Button variant="outline" onClick={onDashboard}>
          Back to Dashboard
        </Button>
        <Button onClick={onChooseCorrectCrop}>
          Choose the Correct Crop
        </Button>
      </div>
    </section>
  );
}
