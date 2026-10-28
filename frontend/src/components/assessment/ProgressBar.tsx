import React from 'react';
import { Icon } from '@/components/common/Icon';

interface ProgressBarProps {
  currentStep: number;
}

const STEPS = ['Add Photo', 'Select Crop', 'Review', 'Assessment'];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <nav className="progress" aria-label={`Step ${currentStep} of 4`}>
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isDone = currentStep > stepNumber;
        const isCurrent = currentStep === stepNumber;

        return (
          <div
            key={label}
            className={`progress-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span>
              {isDone ? <Icon name="check" size={14} /> : stepNumber}
            </span>
            <strong>{label}</strong>
            {index < STEPS.length - 1 && <i aria-hidden="true" />}
          </div>
        );
      })}
    </nav>
  );
}
