'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/common/Icon';
import { WORKSPACE_NAV_ITEMS } from './Sidebar';
import { useLanguage } from '@/context/LanguageContext';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="bottom-nav" aria-label="Mobile workspace bottom navigation">
      {WORKSPACE_NAV_ITEMS.slice(0, 5).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={isActive ? 'active' : ''}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon name={item.icon} size={20} />
            <span>{t(item.labelKey) || item.defaultLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
