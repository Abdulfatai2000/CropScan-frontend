import React from 'react';
import { Icon } from './Icon';

interface DisclaimerBannerProps {
  title?: string;
  message?: string;
  variant?: 'amber' | 'mint';
  className?: string;
}

export function DisclaimerBanner({
  title = 'Responsible Agricultural Advisory',
  message = 'CropScan AI provides assistive guidance based on visual symptoms. It does not replace on-field laboratory verification or local extension officer inspection.',
  variant = 'amber',
  className = '',
}: DisclaimerBannerProps) {
  return (
    <aside
      className={`future-banner ${variant === 'mint' ? 'mint' : ''} ${className}`}
      role="note"
      aria-label={title}
    >
      <Icon name="info" size={18} />
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </aside>
  );
}
