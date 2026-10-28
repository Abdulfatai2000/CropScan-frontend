import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';

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
  return (
    <section className="assessment-card state-card" aria-labelledby="quality-title">
      <div className="state-icon">
        <Icon name="camera" size={32} />
      </div>
      <span className="kicker">Image quality screening issue</span>
      <h2 id="quality-title">Please Try a Clearer Photo</h2>
      <p className="state-body">
        {qualityWarning ||
          'The uploaded photograph is too blurry, overly dark, overexposed, or uniform for a reliable computer vision assessment.'}
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted leaf with quality issue" />
        <div>
          <span>Selected crop</span>
          <strong>{selectedCrop}</strong>
          <small>Image rejected by automated pre-screening checks.</small>
        </div>
      </div>

      <div className="state-tips">
        <strong>How to capture a valid leaf photo:</strong>
        <span>
          <Icon name="check" size={15} /> Move to even, indirect natural sunlight
        </span>
        <span>
          <Icon name="check" size={15} /> Hold the smartphone camera steady to avoid motion blur
        </span>
        <span>
          <Icon name="check" size={15} /> Ensure the leaf blade fills at least 60% of the frame
        </span>
        <span>
          <Icon name="check" size={15} /> Clean the camera lens and tap the screen to focus on the spots
        </span>
      </div>

      <div className="card-actions center">
        <Button variant="outline" onClick={onDashboard}>
          Back to Dashboard
        </Button>
        <Button onClick={onUploadAnother}>
          Upload Another Photo
        </Button>
      </div>
    </section>
  );
}
