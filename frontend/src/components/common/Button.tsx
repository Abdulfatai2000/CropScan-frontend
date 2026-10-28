import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Icon, IconName } from './Icon';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: IconName;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  full?: boolean;
  href?: string;
  className?: string;
  'aria-label'?: string;
}

export function Button({
  children,
  variant = 'primary',
  icon,
  onClick,
  type = 'button',
  disabled = false,
  full = false,
  href,
  className = '',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const combinedClasses = `btn btn-${variant}${full ? ' btn-full' : ''} ${className}`.trim();

  const content = (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {variant === 'primary' && !icon && <Icon name="arrow" size={17} />}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
