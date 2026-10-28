import React, { ReactNode } from 'react';
import { Icon, IconName } from './Icon';

interface BadgeProps {
  children: ReactNode;
  icon?: IconName;
  variant?: 'eyebrow' | 'small' | 'count' | 'future' | 'success' | 'ai';
  className?: string;
}

export function Badge({ children, icon, variant = 'eyebrow', className = '' }: BadgeProps) {
  if (variant === 'count') {
    return <span className={`count-badge ${className}`}>{children}</span>;
  }

  if (variant === 'future') {
    return <span className={`future-tag ${className}`}>{children}</span>;
  }

  if (variant === 'success') {
    return (
      <span className={`success-badge ${className}`}>
        {icon && <Icon name={icon} size={14} />}
        <span>{children}</span>
      </span>
    );
  }

  if (variant === 'ai') {
    return (
      <span className={`ai-label ${className}`}>
        {icon && <Icon name={icon} size={14} />}
        <span>{children}</span>
      </span>
    );
  }

  const baseClass = variant === 'eyebrow' ? 'eyebrow' : 'small-badge';

  return (
    <div className={`${baseClass} ${className}`}>
      {icon && (
        <span>
          <Icon name={icon} size={14} />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}
