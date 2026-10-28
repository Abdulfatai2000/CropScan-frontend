import React from 'react';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';

interface StepProcessingProps {
  previewUrl: string;
  crop: Crop;
}

export function StepProcessing({ previewUrl, crop }: StepProcessingProps) {
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
        <i aria-hidden="true" /> Assessment in progress
      </span>
      <h2>Analyzing your leaf…</h2>
      <p>CropScan AI is examining the image for visual patterns associated with supported crop-health conditions.</p>
      <div className="processing-meta">
        <span>
          <Icon name="leaf" size={17} /> Selected crop: <strong>{crop}</strong>
        </span>
        <span>
          <Icon name="shield" size={17} /> Please keep this page open
        </span>
      </div>
      <small>This may take a moment. We will not submit the image twice.</small>
    </section>
  );
}
