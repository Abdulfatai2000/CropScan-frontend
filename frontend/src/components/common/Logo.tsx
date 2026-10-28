import React from 'react';
import Link from 'next/link';
import { Icon } from './Icon';

interface LogoProps {
  light?: boolean;
  href?: string;
  className?: string;
}

export function Logo({ light = false, href = '/', className = '' }: LogoProps) {
  return (
    <Link
      href={href}
      className={`logo ${light ? 'logo-light' : ''} ${className}`}
      aria-label="CropScan AI Home"
    >
      <span className="logo-mark">
        <Icon name="leaf" size={21} />
        <i />
      </span>
      <span>
        CropScan <b>AI</b>
      </span>
    </Link>
  );
}
