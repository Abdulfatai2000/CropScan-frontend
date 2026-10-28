'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { Icon, IconName } from '@/components/common/Icon';
import { useLanguage } from '@/context/LanguageContext';

interface NavItem {
  href: string;
  labelKey: string;
  defaultLabel: string;
  icon: IconName;
}

export const WORKSPACE_NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', labelKey: 'nav.overview', defaultLabel: 'Overview', icon: 'grid' },
  { href: '/scan', labelKey: 'nav.newScan', defaultLabel: 'New Assessment', icon: 'scan' },
  { href: '/history', labelKey: 'nav.history', defaultLabel: 'Assessment History', icon: 'history' },
  { href: '/guide', labelKey: 'nav.guide', defaultLabel: 'Crop Guide', icon: 'book' },
  { href: '/settings', labelKey: 'nav.settings', defaultLabel: 'Settings', icon: 'settings' },
  { href: '/help', labelKey: 'nav.help', defaultLabel: 'Help', icon: 'help' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="sidebar" aria-label="Desktop workspace sidebar">
      <Logo href="/dashboard" />
      <nav aria-label="Workspace navigation">
        <span className="nav-label">Workspace</span>
        {WORKSPACE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'active' : ''}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon name={item.icon} size={19} />
              <span>{t(item.labelKey) || item.defaultLabel}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-note">
        <span>
          <Icon name="shield" size={18} />
        </span>
        <strong>Screen responsibly</strong>
        <p>AI results are advisory assistance, not confirmed laboratory diagnoses.</p>
      </div>

      <Link href="/" className="back-site">
        <Icon name="arrow" size={16} />
        Back to website
      </Link>
    </aside>
  );
}
