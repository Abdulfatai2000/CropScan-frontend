import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';

interface ResultInconclusiveProps {
  previewUrl: string;
  selectedCrop: Crop;
  onTryAnotherPhoto: () => void;
  onDashboard: () => void;
}

export function ResultInconclusive({
  previewUrl,
  selectedCrop,
  onTryAnotherPhoto,
  onDashboard,
}: ResultInconclusiveProps) {
  return (
    <section className="assessment-card state-card" aria-labelledby="inconclusive-title">
      <div className="state-icon">
        <Icon name="help" size={32} />
      </div>
      <span className="kicker">Inconclusive assessment</span>
      <h2 id="inconclusive-title">We Couldn’t Identify the Condition Confidently</h2>
      <p className="state-body">
        The model did not produce a sufficiently confident prediction for this leaf. This does not mean your plant is healthy, but actionable chemical guidance has been withheld for safety.
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted leaf" />
        <div>
          <span>Selected crop</span>
          <strong>{selectedCrop}</strong>
          <small>Uncertain output withheld from agronomic advice.</small>
        </div>
      </div>

      <div className="state-tips">
        <strong>What to do next:</strong>
        <span>
          <Icon name="check" size={15} /> Take another photo under even, natural daylight
        </span>
        <span>
          <Icon name="check" size={15} /> Focus closely on the most affected leaf section
        </span>
        <span>
          <Icon name="check" size={15} /> Avoid motion blur, glare, and excessive shadow
        </span>
        <span>
          <Icon name="check" size={15} /> Consult a local extension officer if symptoms worsen
        </span>
      </div>

      <div className="card-actions center">
        <Button variant="outline" onClick={onDashboard}>
          Back to Dashboard
        </Button>
        <Button onClick={onTryAnotherPhoto}>
          Try Another Photo
        </Button>
      </div>
    </section>
  );
}
