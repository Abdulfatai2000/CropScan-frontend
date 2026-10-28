import React from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Crop } from '@/types/crops';

interface ResultRequestErrorProps {
  previewUrl: string;
  selectedCrop: Crop;
  errorMessage?: string;
  onRetry: () => void;
  onDashboard: () => void;
}

export function ResultRequestError({
  previewUrl,
  selectedCrop,
  errorMessage,
  onRetry,
  onDashboard,
}: ResultRequestErrorProps) {
  return (
    <section className="assessment-card state-card state-request_error" aria-labelledby="error-title">
      <div className="state-icon">
        <Icon name="refresh" size={32} />
      </div>
      <span className="kicker">Connection or server problem</span>
      <h2 id="error-title">We Couldn’t Complete the Assessment</h2>
      <p className="state-body">
        {errorMessage || 'The server could not process this request. Your photo and crop selection have been kept safely.'}
      </p>

      <div className="state-context">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Submitted leaf" />
        <div>
          <span>Selected crop</span>
          <strong>{selectedCrop}</strong>
          <small>Your image remains stored in memory.</small>
        </div>
      </div>

      <div className="state-tips">
        <strong>Suggested actions:</strong>
        <span>
          <Icon name="check" size={15} /> Check your network connection
        </span>
        <span>
          <Icon name="check" size={15} /> Wait a moment and retry analysis
        </span>
        <span>
          <Icon name="check" size={15} /> Your selected image will not be lost
        </span>
      </div>

      <div className="card-actions center">
        <Button variant="outline" onClick={onDashboard}>
          Back to Dashboard
        </Button>
        <Button onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </section>
  );
}
